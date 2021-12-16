package middleware

import (
	"encoding/json"
	"net/http"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
)

func GetOtpMiddleware(config config.Config) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			otp := r.URL.Query().Get("otp")

			resp, err := http.Get(config.Gateway + "?otp=" + otp)

			if err != nil {
				pkg.ResponseError(w, http.StatusInternalServerError, "OTP verification error")
				return
			}

			var otpResponse struct {
				Valid bool `json:"valid"`
			}
			err = json.NewDecoder(resp.Body).Decode(&otpResponse)

			if err != nil {
				pkg.ResponseError(w, http.StatusInternalServerError, "OTP Decoding error")
				return
			}

			resp.Body.Close()

			if !otpResponse.Valid {
				pkg.ResponseError(w, http.StatusForbidden, "Invalid OTP")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
