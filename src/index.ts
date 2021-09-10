import express, { Application } from "express";
import redis from "redis";
import connectRedis from "connect-redis";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import {
	PORT,
	CLIENT_DOMAIN,
	MONGO_URL,
	REDIS_HOST,
	REDIS_PORT,
	SESSION_SECRET,
	PROD,
} from "./util/environment";
import projectRoutes from "./routes/project.routes";
import userRoutes from "./routes/user.routes";
import columnRoutes from "./routes/column.routes";
import ticketRoutes from "./routes/ticket.routes";
import { apiresponse } from "./middlewares/apiresponse";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
	host: REDIS_HOST,
	port: REDIS_PORT,
});

const app: Application = express();
//adding logging middleware
app.use(morgan("tiny"));
/*
    Adding cors, form-body and json middlewares
    going to use cookies so setting credentials to true, and allowing fixed origin
*/
app.use(
	cors({
		credentials: true,
		origin: CLIENT_DOMAIN,
	})
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//use session middleware
app.use(
	session({
		store: new RedisStore({
			client: redisClient,
		}),
		secret: SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		cookie: {
			httpOnly: true,
			secure: PROD,
			maxAge: 1000 * 60 * 30, //30 minutes
		},
	})
);

mongoose
	.connect(MONGO_URL)
	.then((_result) => console.log("connected to mongoDB!"))
	.catch((error) => console.log(error));

app.use(apiresponse);

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/columns", columnRoutes);
app.use("/tickets", ticketRoutes);
//if no route returns response, send 404
app.use((_, res) => res.sendStatus(404));

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
