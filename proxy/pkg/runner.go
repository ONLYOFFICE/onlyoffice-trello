// A plain 'external' wrapper over main registry methods
package pkg

import (
	"net/http"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
	"github.com/gorilla/mux"
)

type Service interface {
	GetName() string
}

type Handler interface {
	GetPath() string
	GetMethod() string
	GetHandle() http.HandlerFunc
}

func RegisterService(service Service) error {
	return internal.RegistryRegisterService(service)
}

func RegisterHandler(handler Handler) error {
	return internal.RegistryRegisterHandler(handler)
}

func WireHandlers(mux *mux.Router) {
	internal.RegistryWireHandlers(mux)
}

func GetService(service interface{}) error {
	return internal.RegistryGetService(service)
}
