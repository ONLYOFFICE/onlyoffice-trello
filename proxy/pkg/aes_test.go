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
