package handlers

import (
	"net/http"
	"net/http/httputil"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
)

var _ = NewProxyHandler()

type ProxyHandler struct {
	Path string
	rp   *httputil.ReverseProxy
}

func NewProxyHandler() bool {
	prx, err := internal.NewProxy(internal.ProxyParameters{
		To:        "trello.com",
		Protocol:  "https",
		Path:      "/",
		AuthValue: " ",
	})

	if err != nil {
		return false
	}

	ph := &ProxyHandler{
		Path: "/proxy",
		rp:   prx,
	}

	internal.GetRegistry().RegisterHandler(ph.Path, ph.GetProxy)

	return true
}

func (ph *ProxyHandler) GetProxy(w http.ResponseWriter, r *http.Request) {
	ph.rp.ServeHTTP(w, r)
}
