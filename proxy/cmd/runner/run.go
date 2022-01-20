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
	srv "github.com/ONLYOFFICE/onlyoffice-trello/server"
	"go.uber.org/zap"
)

func Run() (<-chan error, error) {
	logger, _ := zap.NewProduction()
	config, err := config.NewConfig(config.ConfigParameters{
		Filename: "config.yml",
		Type:     config.ConfigYML,
	})

	if err != nil {
		logger.Fatal(err.Error())
		return nil, err
	}

	mux := srv.NewRouter(config, logger)
	server := srv.NewServer(
		mux,
		srv.WithAddr(fmt.Sprintf("%s:%d", config.Server.Host, config.Server.Port)),
		srv.WithReadTimeout(500*time.Millisecond),
		srv.WithWriteTimeout(4*time.Second),
		srv.WithIdleTimeout(120*time.Second),
		srv.WithErrLogging(log.Default()),
	)

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
