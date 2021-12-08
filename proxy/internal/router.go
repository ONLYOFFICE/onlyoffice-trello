package internal

import (
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func NewRouter(logger *zap.Logger) *mux.Router {
	logger.Info("Registering routes")
	r := mux.NewRouter()

	for params, handler := range GetHandlers() {
		r.HandleFunc(params.Path, handler).Methods(params.Method)
	}

	logger.Info("Successfully registered routes")

	return r
}
