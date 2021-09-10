import { Router } from "express";

import * as auth from "../middlewares/auth";
import * as userController from "../controllers/user.controller";
import * as validator from "../middlewares/validator";

const router = Router();

router.post(
	"/signup",
	validator.validatePresentInBody("username", "password"),
	validator.validateCharacterLength("password", 6),
	userController.signup
);
router.post(
	"/login",
	validator.validatePresentInBody("username", "password"),
	validator.validateCharacterLength("password", 6),
	userController.login
);
router.post("/logout", auth.isLoggedIn, userController.logout);

export default router;
