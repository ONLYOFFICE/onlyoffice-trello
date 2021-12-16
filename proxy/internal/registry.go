package internal

import (
	"fmt"
	"reflect"
	"sync"
)

var _registry *Registry
var _locker = &sync.Mutex{}

type Registry struct {
	services map[reflect.Type]interface{}
	types    []reflect.Type
}

func _GetRegistry() *Registry {
	if _registry == nil {
		_locker.Lock()
		defer _locker.Unlock()
		if _registry == nil {
			_registry = &Registry{
				services: make(map[reflect.Type]interface{}),
			}
		}
	}

	return _registry
}

func _registryRemoveServices() {
	r := _GetRegistry()
	r.services = make(map[reflect.Type]interface{})
}

func RegistryRegisterService(s interface{}) error {
	r := _GetRegistry()
	t := reflect.TypeOf(s)
	_locker.Lock()
	defer _locker.Unlock()
	if _, exists := r.services[t]; exists {
		return ErrRegistryRegistration
	}
	r.services[t] = s
	r.types = append(r.types, t)
	return nil
}

func RegistryGetService(service interface{}) error {
	r := _GetRegistry()
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
