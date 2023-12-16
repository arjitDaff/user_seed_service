import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(info => `${info.timestamp} - ${info.message}`)
  ),
  transports: [
    new transports.File({ filename: 'logs/server.log' })
  ]
});

export default logger;
