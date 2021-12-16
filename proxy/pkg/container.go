// A plain 'external' wrapper over main registry methods
package pkg

import (
	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
)

type RegistryContainer interface {
	RegisterService(service interface{}) error
	GetService(service interface{}) error
}

type BasicContainer struct{}

func NewRegistryContainer() *BasicContainer {
	return &BasicContainer{}
}

func (bc *BasicContainer) RegisterService(service interface{}) error {
	return internal.RegistryRegisterService(service)
}

func (bc *BasicContainer) GetService(service interface{}) error {
	return internal.RegistryGetService(service)
}
