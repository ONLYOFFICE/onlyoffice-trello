package boostrapper

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
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
	srv "github.com/ONLYOFFICE/onlyoffice-trello/server"
	"github.com/ONLYOFFICE/onlyoffice-trello/server/middleware"
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth/limiter"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func Run(container *pkg.BasicContainer) (<-chan error, error) {
	var logger *zap.Logger
	var config config.Config
	err := container.GetService(&config)
	if err != nil {
		panic("config initialization error")
	}
	err = container.GetService(&logger)
	if err != nil {
		panic("logger initialization error")
	}

	router := mux.NewRouter()

	prhandler := srv.NewProxyHandler(config, logger)
	phandler := srv.NewPingHandler()

	proxyRouter := router.Methods(http.MethodGet).Subrouter()
	proxyRouter.HandleFunc(prhandler.GetPath(), middleware.Chain(prhandler.GetHandle(), middleware.GetEncryptionMiddleware(config, logger)).ServeHTTP)

	router.HandleFunc(phandler.GetPath(), phandler.GetHandle()).Methods(phandler.GetMethod())
	router.NotFoundHandler = http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		http.Redirect(rw, r, "/proxy", http.StatusPermanentRedirect)
	})

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
			_ = logger.Sync()
			stop()
			cancel()
			close(errC)
		}()

		if err := server.Shutdown(ctxTimeout); err != nil {
			errC <- err
		}
		logger.Info("Stopping the server now")
	}()

	go func() {
		logger.Info(fmt.Sprintf("Starting the server: %s:%d", config.Server.Host, config.Server.Port))
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errC <- err
		}
	}()

	return errC, nil
}
