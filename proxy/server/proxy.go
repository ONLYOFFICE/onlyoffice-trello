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
		ph.logger.Debug("proxying a new request")
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
