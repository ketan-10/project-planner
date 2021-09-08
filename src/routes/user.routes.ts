import { Router } from "express";

import * as auth from "../middlewares/auth";
import * as userController from "../controllers/user.controller";
import { validateUsernamePassword } from "../middlewares/validator";

const router = Router();

router.post("/signup", validateUsernamePassword, userController.signup);
router.post("/login", validateUsernamePassword, userController.login);
router.post("/logout", auth.isLoggedIn, userController.logout);

export default router;
