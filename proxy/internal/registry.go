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

package internal

import (
	"fmt"
	"reflect"
	"sync"
)

type Registry struct {
	services map[reflect.Type]interface{}
	types    []reflect.Type
	locker   sync.Mutex
}

func NewRegistry() *Registry {
	return &Registry{
		services: make(map[reflect.Type]interface{}),
		locker:   sync.Mutex{},
	}
}

func (r *Registry) RegistryRegisterService(s interface{}) error {
	t := reflect.TypeOf(s)
	r.locker.Lock()
	defer r.locker.Unlock()
	if _, exists := r.services[t]; exists {
		return ErrRegistryRegistration
	}
	r.services[t] = s
	r.types = append(r.types, t)
	return nil
}

func (r *Registry) RegistryGetService(service interface{}) error {
	if reflect.TypeOf(service).Kind() != reflect.Ptr {
		return ErrRegistryInvalidInput
	}
	real := reflect.ValueOf(service).Elem()
	if stored, ok := r.services[real.Type()]; ok {
		real.Set(reflect.ValueOf(stored))
		return nil
	}
	return &ErrRegistry{
		Reason: fmt.Sprintf("unknown service %T", service),
	}
}
