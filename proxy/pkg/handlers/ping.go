package handlers

import (
	"net/http"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
)

var _ = NewPingHandler()

type PingHandler struct{}

type PingResponse struct {
	Ping bool `json:"ping"`
}

func NewPingHandler() bool {
	handler := &PingHandler{}

	internal.RegisterHandler(internal.ProxyRegistryParam{
		Path:   "/ping",
		Method: http.MethodGet,
	}, handler.GetPing)

	return true
}

func (dh *PingHandler) GetPing(w http.ResponseWriter, r *http.Request) {
	response := &PingResponse{
		Ping: true,
	}
	internal.ResponseOK(w, response)
}
