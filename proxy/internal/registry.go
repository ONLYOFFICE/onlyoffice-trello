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
