import dotenv from "dotenv";

dotenv.config({
	path: ".env",
});

export const {
	PORT = 3001,
	NODE_ENV = "development",
	CLIENT_DOMAIN = "http://localhost:5000",
	MONGO_URL = "mongodb://localhost:27017/test",
	REDIS_HOST = "127.0.0.1",
	REDIS_PORT = 6379,
	SESSION_SECRET,
} = process.env;

export const PROD = NODE_ENV === "production";
