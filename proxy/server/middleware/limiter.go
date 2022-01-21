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
