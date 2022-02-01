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

package middleware

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
	"go.uber.org/zap"
)

func GetEncryptionMiddleware(config config.Config, logger *zap.Logger) func(next http.Handler) http.Handler {
	logger.Sugar().Infof("registering encryption middleware with secret")
	cipher := pkg.NewEncryptor(config.Server.Secret)
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			query := r.URL.Query()
			resource := query.Get("resource")
			secret := query.Get("secret")

			res, err := cipher.Decrypt(secret)

			if err != nil {
				logger.Error("could not decrypt secrets")
				logger.Debug(err.Error())
				pkg.ResponseError(w, http.StatusForbidden, "secrets decryption error")
				return
			}

			var p pkg.ProxyParameters
			err = json.Unmarshal([]byte(res), &p)

			if err != nil {
				logger.Error("could not unmarshall secrets")
				logger.Debug(err.Error())
				pkg.ResponseError(w, http.StatusInternalServerError, "secrets unmarshalling error")
				return
			}

			rdecoded, err := base64.StdEncoding.DecodeString(resource)

			if err != nil {
				logger.Error("could not decode resources")
				logger.Debug(err.Error())
				pkg.ResponseError(w, http.StatusForbidden, "resource decoding error")
				return
			}

			err = json.Unmarshal(rdecoded, &p)

			if err != nil {
				logger.Error("could not populate proxy resource parameters")
				logger.Debug(err.Error())
				pkg.ResponseError(w, http.StatusInternalServerError, "could not populate proxy parameters")
				return
			}

			if p.Due <= time.Now().UnixMilli() {
				logger.Error("encrypted payload has expired")
				pkg.ResponseError(w, http.StatusInternalServerError, "encrypted payload is not valid")
				return
			}

			// TODO: Custom headers
			token := strings.ReplaceAll(r.Header.Get(p.DocsHeader), "Bearer ", "")

			err = pkg.ValidateJWT(token, []byte(p.DocsJwt))

			if err != nil {
				logger.Sugar().Errorf("jwt %s is invalid", token)
				pkg.ResponseError(w, http.StatusForbidden, "invalid jwt")
				return
			}

			var key pkg.ProxyParametersHeader
			ctx := context.WithValue(r.Context(), key, p)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}
