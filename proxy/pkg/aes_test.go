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
	"testing"
)

func TestAesDecryption(t *testing.T) {
	var (
		validKey string = "10101010101010101010101010101010"
		validEnc string = "bb02af8d47ce56c6eac8e21df0f506451b393aae01e07301bbe0b219183a933c35a939b295"
		validRes string = "hello"
	)
	t.Parallel()

	tests := []struct {
		name    string
		text    string
		key     string
		withErr bool
	}{
		{
			name:    "OK: Valid Text",
			text:    validEnc,
			key:     validKey,
			withErr: false,
		}, {
			name:    "Failure: Invalid encrypted text length",
			text:    "77c59ff9775ab",
			key:     validKey,
			withErr: true,
		}, {
			name:    "Failure: Invalid decryption key",
			text:    validEnc,
			key:     "mockmockmockmockmockmockmockmock",
			withErr: true,
		}, {
			name:    "Failure: Invalid key length",
			text:    validEnc,
			key:     "mock",
			withErr: true,
		},
	}

	for _, test := range tests {
		tt := test
		encryptor := NewEncryptor([]byte(tt.key))

		t.Run(tt.name, func(t *testing.T) {
			val, actualErr := encryptor.Decrypt(tt.text)

			if (actualErr != nil) != tt.withErr {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}

			if val != validRes && !tt.withErr {
				t.Fatalf("invalid decryption result")
			}
		})
	}
}
