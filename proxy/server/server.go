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
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type Option func(*http.Server)

func WithAddr(address string) func(*http.Server) {
	return func(s *http.Server) {
		s.Addr = address
	}
}

func WithReadTimeout(t time.Duration) func(*http.Server) {
	return func(s *http.Server) {
		s.ReadTimeout = t
	}
}

func WithWriteTimeout(t time.Duration) func(*http.Server) {
	return func(s *http.Server) {
		s.WriteTimeout = t
	}
}

func WithIdleTimeout(t time.Duration) func(*http.Server) {
	return func(s *http.Server) {
		s.IdleTimeout = t
	}
}

func WithErrLogging(log *log.Logger) func(*http.Server) {
	return func(s *http.Server) {
		s.ErrorLog = log
	}
}

func NewServer(router *mux.Router, opts ...Option) http.Server {
	server := http.Server{
		Handler: http.TimeoutHandler(router, 4*time.Second, "Proxy timeout\n"),
	}

	for _, opt := range opts {
		opt(&server)
	}

	return server
}
