package pkg

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
)

type Encryptor struct {
	key []byte
}

func NewEncryptor(key []byte) *Encryptor {
	return &Encryptor{
		key,
	}
}

func (e *Encryptor) Decrypt(text string) (string, error) {
	cipherText, err := hex.DecodeString(text)

	if err != nil {
		return "", err
	}

	if len(cipherText) < 17 {
		return "", internal.ErrAesInvalidTextLength
	}

	block, err := aes.NewCipher(e.key)
	if err != nil {
		return "", internal.ErrAesBlockCreationError
	}

	aead, err := cipher.NewGCMWithNonceSize(block, len(e.key)/2)

	if err != nil {
		return "", internal.ErrAesAeadCreationError
	}

	nonce := cipherText[:aead.NonceSize()]
	data := cipherText[aead.NonceSize():]

	decrypted, err := aead.Open(nil, nonce, data, nil)

	if err != nil {
		return "", err
	}

	return string(decrypted), nil
}
