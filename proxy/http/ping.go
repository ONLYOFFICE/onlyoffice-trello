package handlers

import (
	"net/http"

	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
)

type PingHandler struct {
	path   string
	method string
}

func (ph PingHandler) GetPath() string {
	return ph.path
}

func (ph PingHandler) GetMethod() string {
	return ph.method
}

func (ph PingHandler) GetHandle() http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		response := &PingResponse{
			Ping: true,
		}
		pkg.ResponseOK(rw, response)
	}
}

type PingResponse struct {
	Ping bool `json:"ping"`
}

func NewPingHandler() *PingHandler {
	handler := &PingHandler{
		path:   "/ping",
		method: http.MethodGet,
	}

	return handler
}
