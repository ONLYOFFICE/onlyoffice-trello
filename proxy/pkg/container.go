// A plain 'external' wrapper over main registry methods
package pkg

import (
	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
)

type RegistryContainer struct{}

func NewRegistryContainer() *RegistryContainer {
	return &RegistryContainer{}
}

func (rc *RegistryContainer) RegisterService(service interface{}) error {
	return internal.RegistryRegisterService(service)
}

func (rc *RegistryContainer) GetService(service interface{}) error {
	return internal.RegistryGetService(service)
}
