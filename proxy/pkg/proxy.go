package pkg

import (
	"net/http"
	"net/http/httputil"

	"github.com/go-playground/validator/v10"
	"golang.org/x/net/http2"
)

// TODO: Custom validators
type ProxyParameters struct {
	To        string `validate:"required"`
	Protocol  string `validate:"required"`
	Path      string `validate:"required"`
	AuthValue string
}

func (pp *ProxyParameters) Validate() error {
	validator := validator.New()

	return validator.Struct(pp)
}

func NewProxy(fallback ProxyParameters) (*httputil.ReverseProxy, error) {
	if err := fallback.Validate(); err != nil {
		return nil, err
	}

	tr := &http.Transport{}
	err := http2.ConfigureTransport(tr)
	if err != nil {
		return nil, err
	}
	proxy := &httputil.ReverseProxy{
		Transport: tr,
		Director: func(req *http.Request) {
			params, ok := req.Context().Value("X-Proxy-Params").(*ProxyParameters)

			if !ok || params.Validate() != nil {
				params = &fallback
			}

			req.Header.Add("X-Forwarded-Host", req.Host)
			req.Header.Add("X-Origin-Host", params.To)
			req.Header.Add("Authorization", params.AuthValue)
			req.Host = params.To
			req.URL.Scheme = params.Protocol
			req.URL.Host = params.To
			req.URL.Path = params.Path
			req.Close = true
		},
	}

	return proxy, nil
}
