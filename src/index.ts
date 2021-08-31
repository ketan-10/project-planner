import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";

import { PORT, CLIENT_DOMAIN, MONGO_URL } from "./util/environment";
import userRouter from "./routes/userRoutes";

const app: Application = express();

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

mongoose
	.connect(MONGO_URL as string)
	.then((_result) => console.log("connected to mongoDB!"))
	.catch((err) => console.log(err));

app.use(userRouter);

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
