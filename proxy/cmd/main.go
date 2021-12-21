package main

import (
	"os"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	runner "github.com/ONLYOFFICE/onlyoffice-trello/cmd/runner"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()
	c, err := config.NewConfig(config.ConfigParameters{
		Filename: "config.yml",
		Type:     config.ConfigYML,
	})

	if err != nil {
		logger.Fatal(err.Error())
		os.Exit(1)
	}

	container := pkg.NewRegistryContainer()
	err = container.RegisterService(logger)

	if err != nil {
		logger.Fatal(err.Error())
		os.Exit(1)
	}

	err = container.RegisterService(c)

	if err != nil {
		logger.Fatal(err.Error())
		os.Exit(1)
	}

	errC, err := runner.Run(container)
	if err != nil {
		logger.Fatal(err.Error())
		os.Exit(1)
	}

	if err := <-errC; err != nil {
		logger.Sugar().Fatalf("Error while running: %s", err.Error())
	}
}
