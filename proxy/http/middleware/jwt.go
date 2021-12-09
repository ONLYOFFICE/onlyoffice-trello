package middleware

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
	"github.com/golang-jwt/jwt"
	"github.com/mitchellh/mapstructure"
)

func JwtMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		qtoken := r.URL.Query().Get("token")

		if len(qtoken) == 0 {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		token, err := jwt.Parse(qtoken, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected JWT signing method")
			}

			return []byte("ssecret"), nil
		})

		if err != nil {
			fmt.Println(err.Error())
			w.WriteHeader(http.StatusForbidden)
			return
		}

		if _, ok := token.Claims.(jwt.MapClaims); !ok || !token.Valid {
			fmt.Println("token invalid")
			w.WriteHeader(http.StatusForbidden)
			return
		}

		var p pkg.ProxyParameters
		if err := mapstructure.Decode(token.Claims, &p); err != nil {
			fmt.Println(err.Error())
			w.WriteHeader(http.StatusForbidden)
			return
		}

		var key pkg.ProxyParametersHeader
		ctx := context.WithValue(r.Context(), key, p)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
