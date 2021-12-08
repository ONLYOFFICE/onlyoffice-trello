package handlers

import (
	"net/http"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
)

var _ = NewPingHandler()

type PingHandler struct {
	Path string
}

type PingResponse struct {
	Health bool `json:"health"`
}

func NewPingHandler() bool {
	handler := &PingHandler{
		Path: "/ping",
	}

	internal.GetRegistry().RegisterHandler(handler.Path, handler.GetPing)

	return true
}

func (dh *PingHandler) GetPing(w http.ResponseWriter, r *http.Request) {
	response := &PingResponse{
		Health: true,
	}
	internal.ResponseOK(w, response)
}
