package pkg

import (
	"errors"

	"github.com/golang-jwt/jwt"
)

func ValidateJWT(token string, secret []byte) error {
	_, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("jwt validation error")
		}
		return secret, nil
	})

	return err
}
