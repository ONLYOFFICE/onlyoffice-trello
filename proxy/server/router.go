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
	"time"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	"github.com/ONLYOFFICE/onlyoffice-trello/server/middleware"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func NewRouter(config config.Config, logger *zap.Logger) (*mux.Router, error) {
	ilmt, err := middleware.NewRateLimiter(uint64(config.Server.IPLimit), time.Second, middleware.WithKeyFuncIP)
	if err != nil {
		return nil, err
	}

	lmt, err := middleware.NewRateLimiter(uint64(config.Server.Limit), time.Second, middleware.WithKeyFuncAll)
	if err != nil {
		return nil, err
	}

	router := mux.NewRouter()

	prhandler := NewProxyHandler(config, logger)

	router.HandleFunc(
		prhandler.GetPath(),
		middleware.Chain(
			prhandler.GetHandle(),
			middleware.GetEncryptionMiddleware(config, logger),
			lmt.Handle,
			ilmt.Handle,
		).ServeHTTP,
	)

	return router, nil
}
