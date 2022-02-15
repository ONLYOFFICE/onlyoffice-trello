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

import * as joi from 'joi';

export default joi
  .object()
  .keys({
    IS_DEVELOPMENT: joi
      .number()
      .valid(0, 1)
      .required(),
    IS_DEBUG: joi
      .number()
      .valid(0, 1)
      .required(),
    SERVER_HOST: joi
      .string()
      .min(13)
      .description('https://host.domainzone')
      .required(),
    SERVER_PORT: joi
      .number()
      .positive()
      .required(),
    CLIENT_HOST: joi
      .string()
      .min(13)
      .description('https://client.domainzone')
      .required(),
    POWERUP_NAME: joi
      .string()
      .min(4)
      .description('Power-Up name')
      .required(),
    POWERUP_APP_KEY: joi
      .string()
      .min(30)
      .description('Power-Up public key')
      .required(),
    POWERUP_APP_SECRET: joi
      .string()
      .min(60)
      .description('Power-Up secret key')
      .required(),
    POWERUP_APP_ENCRYPTION_KEY: joi
      .string()
      .length(32)
      .description('Power-Up secret encryption key (internal)')
      .required(),
    PROXY_ADDRESS: joi
      .string()
      .min(13)
      .description('https://proxy.domainzone')
      .required(),
    PROXY_ENCRYPTION_KEY: joi
      .string()
      .length(32)
      .description('Proxy secret encryption key (internal)')
      .required(),
  });
