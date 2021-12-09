package internal

import (
	"net/http"
	"testing"
)

type _MockHandler struct {
	path   string
	method string
}

func (_mh _MockHandler) GetPath() string {
	return _mh.path
}

func (_mh _MockHandler) GetMethod() string {
	return _mh.method
}

func (_mh _MockHandler) GetHandle() http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		rw.WriteHeader(http.StatusOK)
	}
}

func TestRegistrateHandler(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		handler _MockHandler
		remove  bool
		withErr bool
	}{
		{
			name: "OK: Valid Handler",
			handler: _MockHandler{
				path:   "/",
				method: http.MethodGet,
			},
			remove:  false,
			withErr: false,
		},
		{
			name: "Failure: Handler Already Exists",
			handler: _MockHandler{
				path:   "/",
				method: http.MethodGet,
			},
			remove:  false,
			withErr: true,
		},
		{
			name: "Failure: No Path Parameter",
			handler: _MockHandler{
				method: http.MethodGet,
			},
			remove:  true,
			withErr: true,
		},
		{
			name: "Failure: No Method Parameter",
			handler: _MockHandler{
				path: "/",
			},
			remove:  true,
			withErr: true,
		},
	}

	for _, test := range tests {
		tt := test

		t.Run(tt.name, func(t *testing.T) {
			if tt.remove {
				RegistryRemoveAllRegisteredHandlers()
			}
			if actualErr := RegistryRegisterHandler(tt.handler); (actualErr != nil) != tt.withErr {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}
		})
	}
}
