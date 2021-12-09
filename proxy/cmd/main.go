package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	endpoints "github.com/ONLYOFFICE/onlyoffice-trello/http"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
	"github.com/gorilla/mux"
)

func main() {
	c, err := config.NewConfig(config.ConfigParameters{
		Filename: "config.yml",
		Type:     config.ConfigYml,
	})

	if err != nil {
		os.Exit(1)
	}

	endpoints.Wire()

	mux := mux.NewRouter()
	pkg.WireHandlers(mux)

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
