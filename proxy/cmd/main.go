package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	endpoint "github.com/ONLYOFFICE/onlyoffice-trello/http"
	"github.com/ONLYOFFICE/onlyoffice-trello/http/middleware"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth/limiter"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()
	c, err := config.NewConfig(config.ConfigParameters{
		Filename: "config.yml",
		Type:     config.ConfigYml,
	})

	if err != nil {
		logger.Fatal(err.Error())
		os.Exit(1)
	}

	errC, err := run(c, logger)
	if err != nil {
		logger.Fatal(err.Error())
		os.Exit(1)
	}

	if err := <-errC; err != nil {
		logger.Sugar().Fatalf("Error while running: %s", err.Error())
	}
}

func run(config config.Config, logger *zap.Logger) (<-chan error, error) {
	container := pkg.NewRegistryContainer()
	container.RegisterService(config)
	container.RegisterService(*logger)

	router := mux.NewRouter()

	prhandler := endpoint.NewProxyHandler(config)
	phandler := endpoint.NewPingHandler()
	khandler := endpoint.NewKeyHandler(config)

	aprhandler := middleware.Adapt(prhandler.GetHandle(), middleware.GetOtpMiddleware(config), middleware.GetEncryptionMiddleware(config))

	router.HandleFunc(prhandler.GetPath(), aprhandler.ServeHTTP).Methods(prhandler.GetMethod())
	router.HandleFunc(phandler.GetPath(), phandler.GetHandle()).Methods(phandler.GetMethod())
	router.HandleFunc(khandler.GetPath(), khandler.GetHandle()).Methods(khandler.GetMethod())
	router.NotFoundHandler = http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		http.Redirect(rw, r, "/proxy", http.StatusPermanentRedirect)
	})

	// TODO: Logging middleware

	lmt := tollbooth.NewLimiter(float64(config.Server.Limit), &limiter.ExpirableOptions{
		DefaultExpirationTTL: 1 * time.Second,
	}).
		SetIPLookups([]string{"RemoteAddr", "X-Forwarded-For", "X-Real-IP"}).
		SetMethods([]string{"GET"}).
		SetOnLimitReached(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusServiceUnavailable)
		})

	mux := tollbooth.LimitHandler(lmt, router)

	server := http.Server{
		Addr:         fmt.Sprintf("%s:%d", config.Server.Host, config.Server.Port),
		ReadTimeout:  2 * time.Millisecond,
		WriteTimeout: 4 * time.Second,
		IdleTimeout:  120 * time.Second,
		ErrorLog:     log.Default(),
		Handler:      http.TimeoutHandler(mux, 4*time.Second, "Proxy timeout\n"),
	}

	errC := make(chan error, 1)
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM, syscall.SIGQUIT)

	go func() {
		<-ctx.Done()
		logger.Info("Received a shutdown signal")
		ctxTimeout, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer func() {
			logger.Sync()
			stop()
			cancel()
			close(errC)
		}()

		if err := server.Shutdown(ctxTimeout); err != nil {
			errC <- err
		}
		logger.Info("Stopping the server now...")
	}()

	go func() {
		logger.Info(fmt.Sprintf("Starting the server: %s:%d", config.Server.Host, config.Server.Port))
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errC <- err
		}
	}()

	return errC, nil
}
