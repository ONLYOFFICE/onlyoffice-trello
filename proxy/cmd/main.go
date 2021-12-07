package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"time"

	"github.com/golang-jwt/jwt"
	"golang.org/x/net/http2"
)

func main() {
	tr := &http.Transport{}
	err := http2.ConfigureTransport(tr)
	if err != nil {
		log.Fatalf("Cannot switch to HTTP2: %v", err)
	}
	proxy := &httputil.ReverseProxy{
		Transport: tr,
		Director: func(req *http.Request) {
			originHost := "placeholder.com"
			req.Header.Add("X-Forwarded-Host", req.Host)
			req.Header.Add("X-Origin-Host", originHost)
			req.Host = originHost
			req.URL.Scheme = "https"
			req.URL.Host = originHost
			req.URL.Path = "/uploads/mysample.docx"
			req.Close = true
		},
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	})

	mux.HandleFunc("/jwt", func(w http.ResponseWriter, r *http.Request) {
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"data": "test",
		})

		tokenString, err := token.SignedString([]byte("secret"))

		if err != nil {
			w.Write([]byte(err.Error()))
		}
		token, errT := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			return []byte("secret"), nil
		})

		if _, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		} else {
			fmt.Println(errT)
		}

		w.Write([]byte(tokenString))
	})

	http.DefaultTransport.(*http.Transport).MaxIdleConns = 1000
	http.DefaultTransport.(*http.Transport).MaxIdleConnsPerHost = 1000

	srv := http.Server{
		ReadTimeout:       3 * time.Second,
		WriteTimeout:      1 * time.Second,
		IdleTimeout:       7 * time.Second,
		ReadHeaderTimeout: 4 * time.Second,
		Handler:           mux,
		Addr:              ":9001",
	}

	log.Fatal(srv.ListenAndServe())
}
