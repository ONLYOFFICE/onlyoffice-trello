package config

import (
	"context"
	"path/filepath"
	"runtime"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
	"github.com/go-playground/validator/v10"
	"github.com/sethvargo/go-envconfig"
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
	Host        string `env:"HOST" validate:"required"`
	Port        int    `env:"PORT" validate:"required"`
	Key         string `env:"PROXY_KEY" validate:"required,len=32"`
	Secret      []byte
	Limit       int `env:"LIMIT" validate:"required,min=1"`
	IPLimit     int `env:"IP_LIMIT" validate:"required,min=1"`
	Environment int `env:"ENV" validate:"required,min=1,max=2"`
}

type Config struct {
	Server ServerConfiguration
	Proxy  pkg.ProxyParameters
}

func (c *Config) Validate() error {
	validator := validator.New()
	return validator.Struct(c)
}

type ConfigParameters struct {
	Filename string
	Type     ConfigType
}

/// TODO: Flags, Refactoring
func NewConfig(params ConfigParameters) (Config, error) {
	var config Config
	config.Server.Environment = 1

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

	verr := viper.ReadInConfig()

	if verr != nil {
		ctx := context.Background()
		if err = envconfig.Process(ctx, &config.Server); err != nil {
			return config, &internal.ErrConfigInitialization{
				Reason: err.Error(),
			}
		}
	} else {
		if err = viper.Unmarshal(&config); err != nil {
			return config, &internal.ErrConfigInitialization{
				Reason: err.Error(),
			}
		}
	}

	if err = config.Validate(); err != nil {
		return config, err
	}

	config.Server.Secret = []byte(config.Server.Key)

	return config, nil
}
