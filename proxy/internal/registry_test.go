package internal

import (
	"testing"
)

type _MockService struct {
	name string
}

func (_ms _MockService) GetName() string {
	return _ms.name
}

func TestRegistrateService(t *testing.T) {
	t.Parallel()

	RegistryRemoveServices()

	tests := []struct {
		name    string
		service _MockService
		withErr bool
	}{
		{
			name: "OK: Valid Service Registration",
			service: _MockService{
				name: "Mock",
			},
			withErr: false,
		},
		{
			name: "Failure: Same Type Registration",
			service: _MockService{
				name: "Mock",
			},
			withErr: true,
		},
	}

	for _, test := range tests {
		tt := test

		t.Run(tt.name, func(t *testing.T) {
			if actualErr := RegistryRegisterService(tt.service); (actualErr != nil) != tt.withErr {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}
		})
	}
}

func TestGetService(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		service _MockService
		withErr bool
	}{
		{
			name: "OK: Valid Service Registration",
			service: _MockService{
				name: "Mock",
			},
			withErr: false,
		},
	}

	for _, test := range tests {
		tt := test

		RegistryRegisterService(tt.service)
		t.Run(tt.name, func(t *testing.T) {
			var ptr _MockService
			if actualErr := RegistryGetService(&ptr); (actualErr != nil) != tt.withErr && len(ptr.GetName()) > 0 {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}
		})
	}
}
