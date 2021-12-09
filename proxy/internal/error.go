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
var ErrRegistryInvalidHandler = errors.New("registry received an invalid handler")
var ErrRegistryNoHandler = errors.New("handler does not exist")
