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
