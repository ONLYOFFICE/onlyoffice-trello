package server

import (
	"net/http"
	"net/http/httputil"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
	"go.uber.org/zap"
)

type ProxyHandler struct {
	path   string
	method string
	logger *zap.Logger
	rp     *httputil.ReverseProxy
}

func (ph ProxyHandler) GetPath() string {
	return ph.path
}

func (ph ProxyHandler) GetMethod() string {
	return ph.method
}

func (ph ProxyHandler) GetHandle() http.HandlerFunc {
	ph.logger.Info("registering a new proxy handler")
	return func(rw http.ResponseWriter, r *http.Request) {
		ph.rp.ServeHTTP(rw, r)
	}
}

func NewProxyHandler(config config.Config, logger *zap.Logger) *ProxyHandler {
	prx, err := pkg.NewProxy(pkg.ProxyParameters{
		To:        config.Proxy.To,
		Path:      config.Proxy.Path,
		AuthValue: config.Proxy.AuthValue,
	})

	if err != nil {
		return nil
	}

	ph := &ProxyHandler{
		path:   "/proxy",
		method: http.MethodGet,
		rp:     prx,
		logger: logger,
	}

	return ph
}
