package internal

import (
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func NewRouter(logger *zap.Logger) *mux.Router {
	logger.Debug("Registering a new router")
	r := mux.NewRouter()

	for path, handler := range GetRegistry().GetHandlers() {
		r.HandleFunc(path, handler)
	}

	logger.Debug("Router registration is done")

	return r
}
