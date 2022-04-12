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

	registry := NewRegistry()

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
			if actualErr := registry.RegistryRegisterService(tt.service); (actualErr != nil) != tt.withErr {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}
		})
	}
}

func TestGetService(t *testing.T) {
	t.Parallel()

	registry := NewRegistry()

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

		err := registry.RegistryRegisterService(tt.service)
		if err != nil {
			t.Fatalf(err.Error())
		}
		t.Run(tt.name, func(t *testing.T) {
			var ptr _MockService
			if actualErr := registry.RegistryGetService(&ptr); (actualErr != nil) != tt.withErr && len(ptr.GetName()) > 0 {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}
		})
	}
}
