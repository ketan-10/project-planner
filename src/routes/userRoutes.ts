import { Router } from "express";

import * as userController from "../controllers/userController";

const userRouter = Router();

userRouter.post("/signup", userController.saveUser);

export default userRouter;
