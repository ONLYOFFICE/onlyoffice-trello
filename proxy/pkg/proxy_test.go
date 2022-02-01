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

package pkg

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestNewProxy(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		params  ProxyParameters
		withErr bool
	}{
		{
			name: "OK: Valid Proxy",
			params: ProxyParameters{
				To:        "google.com",
				Path:      "/",
				AuthValue: "",
			},
			withErr: false,
		},
		{
			name:    "Failure: Fully Invalid Proxy",
			params:  ProxyParameters{},
			withErr: true,
		},
	}

	for _, test := range tests {
		tt := test

		t.Run(tt.name, func(t *testing.T) {
			if _, actualErr := NewProxy(tt.params); (actualErr != nil) != tt.withErr {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}
		})
	}
}

func TestProxyRequest(t *testing.T) {
	t.Parallel()

	proxy, err := NewProxy(ProxyParameters{
		To:        "httpbin.org",
		Path:      "/get",
		AuthValue: "",
	})

	if err != nil {
		t.Fatalf(err.Error())
	}

	handler := func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	}

	req := httptest.NewRequest(http.MethodGet, "/", nil)

	w := httptest.NewRecorder()

	handler(w, req)

	res := w.Result()
	defer res.Body.Close()

	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	if res.StatusCode != http.StatusOK {
		t.Errorf("expected body %d got %d", http.StatusOK, res.StatusCode)
	}
}
