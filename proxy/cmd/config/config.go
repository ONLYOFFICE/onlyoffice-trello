package config

import (
	"path/filepath"
	"runtime"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
	"github.com/go-playground/validator/v10"
	"github.com/spf13/viper"
)

type ConfigType string

const (
	ConfigEnv ConfigType = "env"
)

func (t ConfigType) Validate() error {
	switch t {
	case ConfigEnv:
		return nil
	default:
		return internal.ErrConfigInvalidType
	}
}

type Config struct {
	Address string `mapstructure:"SERVER_ADDRESS" validate:"required"`
	Secret  string `mapstructure:"SERVER_SECRET" validate:"required"`
}

type ConfigParameters struct {
	Filename string
	Type     ConfigType
}

func (c *Config) Validate() error {
	validator := validator.New()

	return validator.Struct(c)
}

// TODO: Add configuration via flags
func NewConfig(params ConfigParameters) (Config, error) {
	var config Config

	_, b, _, _ := runtime.Caller(0)
	dir := filepath.Dir(b)

	err := params.Type.Validate()

	if err != nil {
		return config, err
	}

	viper.AddConfigPath(dir)
	viper.SetConfigFile(params.Filename)
	viper.SetConfigType(string(params.Type))
	viper.AutomaticEnv()

	err = viper.ReadInConfig()

	if err != nil {
		return config, internal.ErrConfigInitialization
	}

	if err = viper.Unmarshal(&config); err != nil {
		return config, internal.ErrConfigInitialization
	}

	if err = config.Validate(); err != nil {
		return config, internal.ErrConfigInitialization
	}

	return config, nil
}
