package handlers

import (
	"net/http"
	"net/http/httputil"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
)

var _ = NewProxyHandler()

type ProxyHandler struct {
	rp *httputil.ReverseProxy
}

func NewProxyHandler() bool {
	prx, err := internal.NewProxy(internal.ProxyParameters{
		To:        "trello.com",
		Protocol:  "https",
		Path:      "/",
		AuthValue: "",
	})

	if err != nil {
		return false
	}

	ph := &ProxyHandler{
		rp: prx,
	}

	params := internal.ProxyRegistryParam{
		Path:   "/proxy",
		Method: http.MethodGet,
	}

	internal.RegisterHandler(params, ph.DoProxy)

	return true
}

func (ph *ProxyHandler) DoProxy(w http.ResponseWriter, r *http.Request) {
	ph.rp.ServeHTTP(w, r)
}
