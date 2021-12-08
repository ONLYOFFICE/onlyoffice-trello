package main

import (
	"log"
	"net/http"
	"time"

	proxy "github.com/ONLYOFFICE/onlyoffice-trello/internal"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg/handlers"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()

	handlers.Bootstrap()

	mux := proxy.NewRouter(logger)
	// TODO: Fix paths
	// config, err := config.NewConfig(config.ConfigParameters{
	// 	Filename: ".env",
	// 	Type:     config.ConfigEnv,
	// })

	// if err != nil {
	// 	logger.Fatal(err.Error())
	// 	os.Exit(1)
	// }

	server := http.Server{
		Addr:         ":8888",
		Handler:      mux,
		ReadTimeout:  7 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
		ErrorLog:     log.Default(),
	}

	// TODO: Graceful shutdown

	log.Fatal(server.ListenAndServe())
}
