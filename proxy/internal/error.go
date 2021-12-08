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

var ErrProxyFallbackValidation = errors.New("proxy fallback validation error")

type ErrSwitchingProtocols struct {
	Protocol string
	Reason   string
}

func (e *ErrSwitchingProtocols) Error() string {
	return fmt.Sprintf("cannot switch protocol %q: %q", e.Protocol, e.Reason)
}
