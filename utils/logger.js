const winston = require('winston');
const { combine, timestamp, printf, json } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info', // Capture info, warn, error
  format: combine(
    timestamp(),
    process.env.NODE_ENV === 'production' ? json() : logFormat // JSON in production, readable in dev
  ),
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
    }),
    new winston.transports.Console({
      level: 'info', // Info and above to console
      format: combine(timestamp(), logFormat), // Readable format for console
    }),
  ],
});

module.exports = logger;
