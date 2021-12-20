// A plain 'external' wrapper over main registry methods
package pkg

import (
	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
)

type RegistryContainer interface {
	RegisterService(service interface{}) error
	GetService(service interface{}) error
}

type BasicContainer struct {
	_registry *internal.Registry
}

func NewRegistryContainer() *BasicContainer {
	return &BasicContainer{
		_registry: internal.NewRegistry(),
	}
}

func (bc *BasicContainer) RegisterService(service interface{}) error {
	return bc._registry.RegistryRegisterService(service)
}

func (bc *BasicContainer) GetService(service interface{}) error {
	return bc._registry.RegistryGetService(service)
}
