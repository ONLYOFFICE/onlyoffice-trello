package internal

import (
	"net/http"
	"sync"

	"github.com/go-playground/validator/v10"
	"go.uber.org/zap"
)

var _locker = &sync.Mutex{}
var _registryContainer *ProxyRegistry

// TODO: Proper Methods validation
type ProxyRegistryParam struct {
	Path   string `validate:"required"`
	Method string `validate:"required"`
}

func (prp *ProxyRegistryParam) Validate() error {
	validator := validator.New()

	return validator.Struct(prp)
}

type ProxyRegistry struct {
	logger   *zap.Logger
	handlers map[ProxyRegistryParam]http.HandlerFunc
}

func _getRegistry() *ProxyRegistry {
	if _registryContainer == nil {
		_locker.Lock()
		defer _locker.Unlock()
		logger, _ := zap.NewProduction()
		if _registryContainer == nil {
			_registryContainer = &ProxyRegistry{
				logger:   logger,
				handlers: make(map[ProxyRegistryParam]http.HandlerFunc),
			}
		}
	}

	return _registryContainer
}

func GetHandlers() map[ProxyRegistryParam]http.HandlerFunc {
	return _getRegistry().handlers
}

func GetLogger() *zap.Logger {
	return _getRegistry().logger
}

func RegisterHandler(params ProxyRegistryParam, handler http.HandlerFunc) error {
	container := _getRegistry()
	err := params.Validate()
	if err != nil {
		return err
	}
	_locker.Lock()
	defer _locker.Unlock()
	container.handlers[params] = handler
	return nil
}
