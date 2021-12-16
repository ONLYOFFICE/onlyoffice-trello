package handlers

import (
	"net/http"
	"net/http/httputil"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
)

type ProxyHandler struct {
	path   string
	method string
	rp     *httputil.ReverseProxy
}

func (ph ProxyHandler) GetPath() string {
	return ph.path
}

func (ph ProxyHandler) GetMethod() string {
	return ph.method
}

func (ph ProxyHandler) GetHandle() http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		ph.rp.ServeHTTP(rw, r)
	}
}

func NewProxyHandler(config config.Config) *ProxyHandler {
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
	}

	return ph
}
