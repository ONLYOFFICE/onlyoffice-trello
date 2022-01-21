package log

import (
	"github.com/natefinch/lumberjack"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func NewProductionLogger() (*zap.Logger, error) {
	writeSyncer, err := getLogWriter()

	if err != nil {
		return nil, err
	}

	encoder := getEncoder()
	core := zapcore.NewCore(encoder, writeSyncer, zapcore.InfoLevel)

	logger := zap.New(core, zap.AddCaller())

	return logger, nil
}

func getEncoder() zapcore.Encoder {
	return zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig())
}

func getLogWriter() (zapcore.WriteSyncer, error) {
	ljLogger := &lumberjack.Logger{
		Filename:   "./proxy.log",
		MaxSize:    10,
		MaxBackups: 5,
		MaxAge:     30,
		Compress:   false,
	}

	return zapcore.AddSync(ljLogger), nil
}
