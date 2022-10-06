import winston from 'winston'

// process logging
const logger = winston.createLogger({
    level: winston.config.syslog.levels,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error', timestamp: true }),
        new winston.transports.File({ filename: './logs/info.log', level: 'info', timestamp: true }),
        new winston.transports.File({ filename: './logs/combined.log', timestamp: true }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export default logger;