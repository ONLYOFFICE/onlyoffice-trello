package server

import (
	"net/http"
	"time"

	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth/limiter"
)

func NewIPRateLimiter(limit float64, exp time.Duration) *limiter.Limiter {
	lmt := tollbooth.NewLimiter(limit, &limiter.ExpirableOptions{
		DefaultExpirationTTL: 1 * time.Second,
	}).
		SetIPLookups([]string{"RemoteAddr", "X-Forwarded-For", "X-Real-IP"}).
		SetMethods([]string{"GET"}).
		SetOnLimitReached(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusServiceUnavailable)
		}).
		SetMessage("You have reached maximum request limit").
		SetMessageContentType("text/plain; charset=utf-8")

	return lmt
}

func NewRateLimiter(limit float64, exp time.Duration) *limiter.Limiter {
	lmt := tollbooth.NewLimiter(limit, &limiter.ExpirableOptions{
		DefaultExpirationTTL: 1 * time.Second,
	}).
		SetMethods([]string{"GET"}).
		SetOnLimitReached(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusServiceUnavailable)
		}).
		SetMessage("Total maximum request limit has been reached").
		SetMessageContentType("text/plain; charset=utf-8")

	return lmt
}
