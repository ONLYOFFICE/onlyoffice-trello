package config

import (
	"testing"
)

func TestNewConfig(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		params  ConfigParameters
		withErr bool
	}{
		{
			name: "OK: Valid config from .env",
			params: ConfigParameters{
				Filename: "mock.yml",
				Type:     ConfigYml,
			},
			withErr: false,
		},
		{
			name: "Failure: No such .yml file",
			params: ConfigParameters{
				Filename: "none.yml",
				Type:     ConfigYml,
			},
			withErr: true,
		},
		{
			name: "Failure: No such file type",
			params: ConfigParameters{
				Filename: "mock.yml",
				Type:     "env",
			},
			withErr: true,
		},
	}

	for _, test := range tests {
		tt := test

		t.Run(tt.name, func(t *testing.T) {
			if _, actualErr := NewConfig(tt.params); (actualErr != nil) != tt.withErr {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}
		})
	}
}