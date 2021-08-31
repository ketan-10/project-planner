import dotenv from "dotenv";

dotenv.config({
	path: ".env",
});

export const {
	PORT = 3001,
	NODE_ENV = "development",
	CLIENT_DOMAIN = "http://localhost:5000",
	MONGO_URL,
} = process.env;
