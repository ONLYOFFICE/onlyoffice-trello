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
	endpoints "github.com/ONLYOFFICE/onlyoffice-trello/http"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
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
	endpoints.Wire()
	mux := mux.NewRouter()
	pkg.WireHandlers(mux)

	// TODO: Logging middleware

	server := http.Server{
		Addr:         fmt.Sprintf("%s:%d", config.Server.Host, config.Server.Port),
		Handler:      mux,
		ReadTimeout:  7 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
		ErrorLog:     log.Default(),
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
