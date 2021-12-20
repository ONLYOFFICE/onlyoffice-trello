package pkg

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
	"github.com/mergermarket/go-pkcs7"
)

type Encryptor struct {
	key []byte
}

func NewEncryptor(key string) *Encryptor {
	return &Encryptor{
		key: []byte(key),
	}
}

func (e *Encryptor) Decrypt(text string) (string, error) {
	cipherText, err := hex.DecodeString(text)

	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(e.key)

	if err != nil {
		return "", err
	}

	if len(cipherText) < aes.BlockSize {
		return "", internal.ErrAesInvalidTextLength
	}

	iv := cipherText[:aes.BlockSize]
	cipherText = cipherText[aes.BlockSize:]

	if len(cipherText)%aes.BlockSize != 0 {
		return "", internal.ErrAesInvalidTextLength
	}

	mode := cipher.NewCBCDecrypter(block, iv)
	mode.CryptBlocks(cipherText, cipherText)

	cipherText, _ = pkcs7.Unpad(cipherText, aes.BlockSize)
	return string(cipherText), nil
}
