import express, { Application } from "express";
import cors from "cors";

import { PORT, CLIENT_DOMAIN } from "./util/environment";

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

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
