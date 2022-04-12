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
	"errors"
	"fmt"
)

type ErrConfigInitialization struct {
	Reason string
}

func (e *ErrConfigInitialization) Error() string {
	return fmt.Sprintf("config initialization error: %q", e.Reason)
}

type ErrContainerGet struct {
	Reason string
}

func (e *ErrContainerGet) Error() string {
	return fmt.Sprintf("container could not get: %q", e.Reason)
}

var ErrConfigUnmarshalling = errors.New("config unmarshalling error")
var ErrConfigInvalidType = errors.New("config invalid type error")

type ErrRegistry struct {
	Reason string
}

func (e *ErrRegistry) Error() string {
	return fmt.Sprintf("registry error: %q", e.Reason)
}

var ErrRegistryRegistration = errors.New("handler type already exists")
var ErrRegistryInvalidInput = errors.New("registry received an invalid input")
var ErrRegistryInvalidService = errors.New("registry received an invalid service")
var ErrRegistryNoService = errors.New("service does not exist")

var ErrAesInvalidTextLength = errors.New("cipher text is too short")
var ErrAesBlockCreationError = errors.New("could not create a new cipher block")
var ErrAesAeadCreationError = errors.New("could not initialize aead")
