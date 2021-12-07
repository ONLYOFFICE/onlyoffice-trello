package internal

import "errors"

var ErrConfigInitialization = errors.New("proxy config initialization error")
var ErrConfigInvalidType = errors.New("proxy config invalid type error")
