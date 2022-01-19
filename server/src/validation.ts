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
      .description('Powerup name')
      .required(),
    POWERUP_ID: joi
      .string()
      .min(20)
      .description('Powerup unique id')
      .required(),
    POWERUP_APP_KEY: joi
      .string()
      .min(30)
      .description('Powerup public key')
      .required(),
    POWERUP_APP_SECRET: joi
      .string()
      .min(60)
      .description('Powerup secret key')
      .required(),
    POWERUP_APP_ENCRYPTION_KEY: joi
      .string()
      .length(32)
      .description('Powerup secret encryption key (internal)')
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