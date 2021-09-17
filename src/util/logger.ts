import winston, { format, Logger } from "winston";
import { PROD } from "./environment";
const { printf } = format;

const loggerFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} [${level}]: ${stack || message}`;
});

const buildDevLogger = (): Logger => {
	return winston.createLogger({
		level: "debug",
		format: format.combine(
			format.colorize(),
			format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
			format.errors({ stack: true }),
			loggerFormat
		),
		transports: [new winston.transports.Console()],
	});
};

const buildProdLogger = (): Logger => {
	return winston.createLogger({
		level: "info",
		format: format.combine(
			format.json(),
			format.timestamp(),
			format.errors({ stack: true }),
			loggerFormat
		),
		transports: [new winston.transports.Console()],
	});
};

const log = PROD ? buildProdLogger() : buildDevLogger();

export default log;
