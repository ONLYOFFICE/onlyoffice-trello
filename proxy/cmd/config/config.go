package config

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"path/filepath"
	"runtime"

	"github.com/ONLYOFFICE/onlyoffice-trello/internal"
	"github.com/ONLYOFFICE/onlyoffice-trello/pkg"
	"github.com/go-playground/validator/v10"
	"github.com/spf13/viper"
)

type ConfigType string

const (
	ConfigYml ConfigType = "yml"
)

func (t ConfigType) Validate() error {
	switch t {
	case ConfigYml:
		return nil
	default:
		return internal.ErrConfigInvalidType
	}
}

type ServerConfiguration struct {
	Host   string `validate:"required"`
	Port   int    `validate:"required"`
	Secret string `validate:"required"`
	Limit  int    `validate:"required"`
}

// TODO: Custom validtors
type Config struct {
	Server     ServerConfiguration
	Proxy      pkg.ProxyParameters
	Gateway    string
	PrivateKey *rsa.PrivateKey
	PublicKey  *pem.Block
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

	viper.SetDefault("server.host", "127.0.0.1")
	viper.SetDefault("server.port", 8080)
	viper.SetDefault("server.secret", "proxy_secret")

	if err = viper.Unmarshal(&config); err != nil {
		return config, internal.ErrConfigUnmarshalling
	}

	config.PublicKey, config.PrivateKey, err = GenerateKeys()

	if err != nil {
		return config, err
	}

	if err = config.Validate(); err != nil {
		return config, err
	}

	return config, nil
}

func GenerateKeys() (pubKey *pem.Block, privKey *rsa.PrivateKey, err error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, 4096)

	if err != nil {
		return nil, nil, err
	}

	publicKey := &privateKey.PublicKey

	publicKeyBytes, err := x509.MarshalPKIXPublicKey(publicKey)

	if err != nil {
		return nil, nil, err
	}

	publicKeyBlock := &pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: publicKeyBytes,
	}

	return publicKeyBlock, privateKey, nil
}
