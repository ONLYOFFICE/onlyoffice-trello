package internal

import (
	"errors"
	"fmt"
)

var ErrConfigInitialization = errors.New("proxy config initialization error")
var ErrConfigInvalidType = errors.New("proxy config invalid type error")

var ErrProxyFallbackValidation = errors.New("proxy fallback validation error")

type ErrSwitchingProtocols struct {
	Protocol string
	Reason   string
}

func (e *ErrSwitchingProtocols) Error() string {
	return fmt.Sprintf("cannot switch protocol %q: %q", e.Protocol, e.Reason)
}
