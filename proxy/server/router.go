package server

import (
	"net/http"
	"time"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	"github.com/ONLYOFFICE/onlyoffice-trello/server/middleware"
	"github.com/didip/tollbooth"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func NewRouter(config config.Config, logger *zap.Logger) http.Handler {
	router := mux.NewRouter()

	prhandler := NewProxyHandler(config, logger)

	proxyRouter := router.Methods(http.MethodGet).Subrouter()
	proxyRouter.HandleFunc(prhandler.GetPath(), middleware.Chain(prhandler.GetHandle(), middleware.GetEncryptionMiddleware(config, logger)).ServeHTTP)

	ilmt := NewIPRateLimiter(float64(config.Server.IPLimit), 1*time.Second)
	lmt := NewRateLimiter(float64(config.Server.Limit), 1*time.Second)

	imux := tollbooth.LimitHandler(ilmt, router)
	mux := tollbooth.LimitHandler(lmt, imux)

	return mux
}
