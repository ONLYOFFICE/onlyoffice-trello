import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const customFormat = winston.format.printf(({
  level, message, timestamp, ...metadata
}) => {
  let msg = `[${timestamp} (${level})] `;
  if (metadata) {
    msg += JSON.stringify(metadata);
  }
  return `${msg} : ${message}`;
});

const WinstonLogger = WinstonModule.createLogger({
  transports: [
    process.env.IS_DEBUG === '1' ? new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        customFormat,
      ),
    }) : new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        customFormat,
      ),
      maxFiles: 5,
      maxsize: 5242880,
    }),
  ],
});

export default WinstonLogger;
