package internal

import (
	"net/http"
	"testing"
)

// TODO: Fix with proper validations
func TestRegistrateHandler(t *testing.T) {
	t.Parallel()

	handler := func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("true"))
	}

	tests := []struct {
		name    string
		handler http.HandlerFunc
		params  ProxyRegistryParam
		withErr bool
	}{
		{
			name:    "OK: Valid Handler",
			handler: handler,
			params: ProxyRegistryParam{
				Path:   "/",
				Method: http.MethodGet,
			},
			withErr: false,
		},
		// TODO: Fix
		{
			name:    "Failure: No Path Parameter",
			handler: handler,
			params: ProxyRegistryParam{
				Method: http.MethodGet,
			},
			withErr: false,
		},
		// TODO: Fix
		{
			name:    "Failure: No Method Parameter",
			handler: handler,
			params: ProxyRegistryParam{
				Path: "/",
			},
			withErr: false,
		},
	}

	for _, test := range tests {
		tt := test

		t.Run(tt.name, func(t *testing.T) {
			params := ProxyRegistryParam{
				Path:   "/testing",
				Method: http.MethodGet,
			}

			if actualErr := RegisterHandler(params, handler); (actualErr != nil) != tt.withErr {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}
		})
	}
}

func TestGetHandlers(t *testing.T) {
	handler := func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("true"))
	}

	RegisterHandler(ProxyRegistryParam{
		Path:   "/",
		Method: http.MethodGet,
	}, handler)

	if len(GetHandlers()) != 1 {
		t.Fatalf("Invalid number of registered handlers")
	}
}
