package middleware

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
)

func GetEncryptionMiddleware(config config.Config) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			query := r.URL.Query()
			resource := query.Get("resource")
			secret := query.Get("secret")

			rdecoded, err := base64.StdEncoding.DecodeString(resource)

			if err != nil {
				pkg.ResponseError(w, http.StatusInternalServerError, "Decoding error")
				return
			}

			sdecoded, err := base64.StdEncoding.DecodeString(secret)
			if err != nil {
				pkg.ResponseError(w, http.StatusInternalServerError, "Decoding error")
				return
			}

			data, err := rsa.DecryptPKCS1v15(rand.Reader, config.PrivateKey, sdecoded)
			if err != nil {
				pkg.ResponseError(w, http.StatusInternalServerError, "Decryption error")
				return
			}

			var p pkg.ProxyParameters
			err = json.Unmarshal([]byte(data), &p)
			if err != nil {
				fmt.Println(err.Error())
				pkg.ResponseError(w, http.StatusInternalServerError, "Could not populate proxy parameters")
				return
			}

			err = json.Unmarshal([]byte(rdecoded), &p)

			if err != nil {
				pkg.ResponseError(w, http.StatusInternalServerError, "Could not populate proxy parameters")
				return
			}

			var key pkg.ProxyParametersHeader
			ctx := context.WithValue(r.Context(), key, p)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}
