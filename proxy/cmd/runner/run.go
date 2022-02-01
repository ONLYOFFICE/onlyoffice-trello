/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */

package boostrapper

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ONLYOFFICE/onlyoffice-trello/cmd/config"
	logging "github.com/ONLYOFFICE/onlyoffice-trello/cmd/log"
	srv "github.com/ONLYOFFICE/onlyoffice-trello/server"
	"go.uber.org/zap"
)

func Run() (<-chan error, error) {
	logger, _ := zap.NewDevelopment()
	config, err := config.NewConfig(config.ConfigParameters{
		Filename: "config.yml",
		Type:     config.ConfigYML,
	})

	if err != nil {
		logger.Fatal(err.Error())
		return nil, err
	}

	if config.Server.Environment == 2 {
		logger, err = logging.NewProductionLogger()
		if err != nil {
			return nil, err
		}
	}

	mux, err := srv.NewRouter(config, logger)
	if err != nil {
		return nil, err
	}

	server := srv.NewServer(
		mux,
		srv.WithAddr(fmt.Sprintf("%s:%d", config.Server.Host, config.Server.Port)),
		srv.WithReadTimeout(3*time.Second),
		srv.WithWriteTimeout(4*time.Second),
		srv.WithIdleTimeout(120*time.Second),
		srv.WithErrLogging(log.Default()),
	)

	errC := make(chan error, 1)
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM, syscall.SIGQUIT)

	go func() {
		<-ctx.Done()
		logger.Info("Received a shutdown signal")
		ctxTimeout, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer func() {
			_ = logger.Sync()
			stop()
			cancel()
			close(errC)
		}()

		if err := server.Shutdown(ctxTimeout); err != nil {
			errC <- err
		}
		logger.Debug("Stopping the server now")
	}()

	go func() {
		logger.Info(fmt.Sprintf("Starting the server: %s:%d", config.Server.Host, config.Server.Port))
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errC <- err
		}
	}()

	return errC, nil
}
