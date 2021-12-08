package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
	proxy "github.com/ONLYOFFICE/onlyoffice-trello/internal"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg/handlers"
)

func main() {
	logger := internal.GetLogger()

	c, err := config.NewConfig(config.ConfigParameters{
		Filename: "config.yml",
		Type:     config.ConfigYml,
	})

	if err != nil {
		logger.Fatal(err.Error())
		os.Exit(1)
	}

	handlers.Bootstrap()

	mux := proxy.NewRouter(logger)

	server := http.Server{
		Addr:         fmt.Sprintf("%s:%d", c.Server.Host, c.Server.Port),
		Handler:      mux,
		ReadTimeout:  7 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
		ErrorLog:     log.Default(),
	}

	// TODO: Graceful shutdown

	log.Fatal(server.ListenAndServe())
}
