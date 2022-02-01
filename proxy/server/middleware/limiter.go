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
	"net/http"
	"time"

	"github.com/sethvargo/go-limiter/httplimit"
	"github.com/sethvargo/go-limiter/memorystore"
)

type Option func() httplimit.KeyFunc

const (
	allRequests = "ALL"
)

func WithKeyFuncIP() httplimit.KeyFunc {
	return httplimit.IPKeyFunc("RemoteAddr", "X-Forwarded-For", "X-Real-IP")
}

func WithKeyFuncAll() httplimit.KeyFunc {
	return func(r *http.Request) (string, error) {
		return allRequests, nil
	}
}

func NewRateLimiter(limit uint64, exp time.Duration, keyFunc Option) (*httplimit.Middleware, error) {
	store, err := memorystore.New(&memorystore.Config{
		Tokens:   limit,
		Interval: exp,
	})

	if err != nil {
		return nil, err
	}

	return httplimit.NewMiddleware(store, keyFunc())
}
