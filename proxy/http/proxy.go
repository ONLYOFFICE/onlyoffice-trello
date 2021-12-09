package handlers

import (
	"net/http"
	"net/http/httputil"

	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
)

var _ = NewProxyHandler()

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

func NewProxyHandler() bool {
	prx, err := pkg.NewProxy(pkg.ProxyParameters{
		To:        "trello.com",
		Protocol:  "https",
		Path:      "/",
		AuthValue: "",
	})

	if err != nil {
		return false
	}

	ph := &ProxyHandler{
		path:   "/proxy",
		method: http.MethodGet,
		rp:     prx,
	}

	pkg.RegisterHandler(ph)

	return true
}
