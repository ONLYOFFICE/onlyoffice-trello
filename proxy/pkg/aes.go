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
