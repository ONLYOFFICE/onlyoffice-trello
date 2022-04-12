/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */

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
