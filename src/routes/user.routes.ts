import { Router } from "express";

import * as userController from "../controllers/user.controller";
import { validateUsernamePassword } from "../middlewares/validator";

const router = Router();

router.post("/signup", validateUsernamePassword, userController.signup);
router.post("/login", validateUsernamePassword, userController.login);

export default router;
