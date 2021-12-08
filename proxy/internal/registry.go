package internal

import (
	"net/http"
	"sync"
)

var _locker = &sync.Mutex{}
var _registryContainer *ProxyRegistry

type ProxyRegistry struct {
	locker   *sync.Mutex
	handlers map[string]http.HandlerFunc
}

func GetRegistry() *ProxyRegistry {
	if _registryContainer == nil {
		_locker.Lock()
		defer _locker.Unlock()
		if _registryContainer == nil {
			_registryContainer = &ProxyRegistry{
				locker:   &sync.Mutex{},
				handlers: make(map[string]http.HandlerFunc),
			}
		}
	}
	return _registryContainer
}

func (pr *ProxyRegistry) GetHandlers() map[string]http.HandlerFunc {
	return pr.handlers
}

func (pr *ProxyRegistry) RegisterHandler(path string, hander http.HandlerFunc) {
	pr.locker.Lock()
	defer pr.locker.Unlock()
	pr.handlers[path] = hander
}
