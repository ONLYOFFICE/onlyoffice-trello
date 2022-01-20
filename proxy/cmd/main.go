package main

import (
	"log"
	"os"

	runner "github.com/ONLYOFFICE/onlyoffice-trello/cmd/runner"
)

func main() {
	errC, err := runner.Run()
	if cErr := <-errC; cErr != nil || err != nil {
		log.Fatal("Runner initialization error")
		os.Exit(1)
	}
}
