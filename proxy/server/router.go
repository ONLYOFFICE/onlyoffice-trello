package server

import (
	"time"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	"github.com/ONLYOFFICE/onlyoffice-trello/server/middleware"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func NewRouter(config config.Config, logger *zap.Logger) (*mux.Router, error) {
	ilmt, err := middleware.NewRateLimiter(uint64(config.Server.IPLimit), time.Second, middleware.WithKeyFuncIP)
	if err != nil {
		return nil, err
	}

	lmt, err := middleware.NewRateLimiter(uint64(config.Server.Limit), time.Second, middleware.WithKeyFuncAll)
	if err != nil {
		return nil, err
	}

	router := mux.NewRouter()

	prhandler := NewProxyHandler(config, logger)

	router.HandleFunc(
		prhandler.GetPath(),
		middleware.Chain(
			prhandler.GetHandle(),
			middleware.GetEncryptionMiddleware(config, logger),
			lmt.Handle,
			ilmt.Handle,
		).ServeHTTP,
	)

	return router, nil
}
