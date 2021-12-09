package internal

import (
	"fmt"
	"net/http"
	"reflect"
	"sync"

	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

var _registry *Registry
var _locker = &sync.Mutex{}

type Handler interface {
	GetPath() string
	GetMethod() string
	GetHandle() http.HandlerFunc
}

type Service interface {
	GetName() string
}

type Registry struct {
	logger   *zap.Logger
	handlers map[reflect.Type]Handler
	services map[reflect.Type]Service
	types    []reflect.Type
}

func _GetRegistry() *Registry {
	if _registry == nil {
		_locker.Lock()
		defer _locker.Unlock()
		logger, _ := zap.NewProduction()
		if _registry == nil {
			_registry = &Registry{
				logger:   logger,
				handlers: make(map[reflect.Type]Handler),
				services: make(map[reflect.Type]Service),
			}
		}
	}

	return _registry
}

func _ValidateHandler(h Handler) error {
	p := h.GetPath()
	if len(p) == 0 {
		return ErrRegistryInvalidHandler
	}
	m := h.GetMethod()
	switch m {
	case http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodPatch, http.MethodOptions, http.MethodHead:
		return nil
	default:
		return ErrRegistryInvalidHandler
	}
}

func RegistryRegisterHandler(h Handler) error {
	r := _GetRegistry()
	t := reflect.TypeOf(h)
	if _, exists := r.handlers[t]; exists {
		return ErrRegistryRegistration
	}
	err := _ValidateHandler(h)
	if err != nil {
		return err
	}
	r.handlers[t] = h
	r.types = append(r.types, t)
	return nil
}

func RegistryRemoveRegisterHandler(h Handler) error {
	r := _GetRegistry()
	t := reflect.TypeOf(h)
	if _, exists := r.handlers[t]; !exists {
		return ErrRegistryNoHandler
	}
	delete(r.handlers, t)
	return nil
}

func RegistryRemoveAllRegisteredHandlers() {
	r := _GetRegistry()
	r.handlers = make(map[reflect.Type]Handler)
}

func RegistryRegisterService(s Service) error {
	r := _GetRegistry()
	t := reflect.TypeOf(s)
	if _, exists := r.services[t]; exists {
		return ErrRegistryRegistration
	}
	r.services[t] = s
	r.types = append(r.types, t)
	return nil
}

// TODO: Generic interface
func RegistryWireHandlers(mux *mux.Router) {
	r := _GetRegistry()
	r.logger.Info("Registering all routes")
	for _, t := range r.handlers {
		r.logger.Sugar().Infof("Registering route of type %v", t)
		mux.HandleFunc(t.GetPath(), t.GetHandle()).Methods(t.GetMethod())
	}
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
