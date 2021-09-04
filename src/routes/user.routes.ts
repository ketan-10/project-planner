import { Router } from "express";

import * as userController from "../controllers/user.controller";

const router = Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);

export default router;
