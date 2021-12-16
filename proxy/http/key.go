package handlers

import (
	"encoding/pem"
	"net/http"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
)

type KeyHandler struct {
	path   string
	method string
	config config.Config
}

func (kh KeyHandler) GetPath() string {
	return kh.path
}

func (kh KeyHandler) GetMethod() string {
	return kh.method
}

func (kh KeyHandler) GetHandle() http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		rw.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
		rw.Header().Set("Access-Control-Allow-Methods", "GET")
		pem.Encode(rw, kh.config.PublicKey)
	}
}

func NewKeyHandler(config config.Config) *KeyHandler {
	handler := &KeyHandler{
		path:   "/key",
		method: http.MethodGet,
		config: config,
	}

	return handler
}
