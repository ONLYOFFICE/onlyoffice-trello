/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */

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

			req.Header.Set("X-Forwarded-Host", req.Host)
			req.Header.Set("X-Origin-Host", params.To)
			req.Header.Set("Authorization", params.AuthValue)
			req.Host = params.To
			req.URL.Scheme = "https"
			req.URL.Host = params.To
			req.URL.Path = params.Path
			req.Close = true
		},
	}

	return proxy, nil
}
