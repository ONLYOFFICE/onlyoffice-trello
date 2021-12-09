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
		To:        "api.trello.com",
		Protocol:  "https",
		Path:      "/1/cards/618d312127da4b34e73ac639/attachments",
		AuthValue: `OAuth oauth_consumer_key="d37bc2f33dcb4996b6fb046d8e4df087",oauth_token="bfe95684ed54d90b81e48f3131184a3df3c390721f3266d4553745367c8700f9",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1638951717",oauth_nonce="TCVnqUXI09A",oauth_version="1.0",oauth_signature="T%2F%2FniDNXNO6kWAW%2B3Te37YHFncQ%3D"`,
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
