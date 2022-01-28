package pkg

import (
	"net/http"
	"net/http/httputil"

	"golang.org/x/net/http2"
)

type ProxyParametersHeader struct{}

type ProxyParameters struct {
	To         string `json:"to"`
	Path       string `json:"path"`
	AuthValue  string `json:"authValue"`
	DocsHeader string `json:"docsHeader"`
	DocsJwt    string `json:"docsJwt"`
	Due        int64  `json:"due"`
}

func NewProxy(fallback ProxyParameters) (*httputil.ReverseProxy, error) {
	tr := &http.Transport{}
	err := http2.ConfigureTransport(tr)
	if err != nil {
		return nil, err
	}
	proxy := &httputil.ReverseProxy{
		Transport: tr,
		Director: func(req *http.Request) {
			var key ProxyParametersHeader
			params, ok := req.Context().Value(key).(ProxyParameters)

			if !ok {
				req.Close = true
				return
			}

			req.Header.Add("X-Forwarded-Host", req.Host)
			req.Header.Add("X-Origin-Host", params.To)
			req.Header.Add("Authorization", params.AuthValue)
			req.Host = params.To
			req.URL.Scheme = "https"
			req.URL.Host = params.To
			req.URL.Path = params.Path
			req.Close = true
		},
	}

	return proxy, nil
}
