package config

import (
	"path/filepath"
	"runtime"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
	"github.com/go-playground/validator/v10"
	"github.com/spf13/viper"
)

type ConfigType string

const (
	ConfigYML ConfigType = "yml"
)

func (t ConfigType) Validate() error {
	switch t {
	case ConfigYML:
		return nil
	default:
		return internal.ErrConfigInvalidType
	}
}

type ServerConfiguration struct {
	Host   string `validate:"required"`
	Port   int    `validate:"required"`
	Secret string `validate:"required,len=32"`
	Limit  int    `validate:"required,min=1"`
}

type Config struct {
	Server  ServerConfiguration
	Proxy   pkg.ProxyParameters
	Gateway string
}

func (c *Config) Validate() error {
	validator := validator.New()
	return validator.Struct(c)
}

type ConfigParameters struct {
	Filename string
	Type     ConfigType
}

/// TODO: Flags
func NewConfig(params ConfigParameters) (Config, error) {
	var config Config

	err := params.Type.Validate()

	if err != nil {
		return config, err
	}

	_, b, _, _ := runtime.Caller(0)
	dir := filepath.Dir(b)

	viper.AddConfigPath(dir)

	viper.SetConfigFile(params.Filename)
	viper.SetConfigType(string(params.Type))

	viper.AutomaticEnv()

	err = viper.ReadInConfig()

	if err != nil {
		return config, &internal.ErrConfigInitialization{
			Reason: err.Error(),
		}
	}

	if err = viper.Unmarshal(&config); err != nil {
		return config, internal.ErrConfigUnmarshalling
	}

	if err != nil {
		return config, err
	}

	if err = config.Validate(); err != nil {
		return config, err
	}

	return config, nil
}
