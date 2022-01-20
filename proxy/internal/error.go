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
