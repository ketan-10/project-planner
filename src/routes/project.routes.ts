import { Router } from "express";

import * as projectController from "../controllers/project.controller";
import * as validator from "../middlewares/validator";
import * as auth from "../middlewares/auth";

const router = Router();

router.use(auth.isLoggedIn);

router.post("/", validator.validateProjectName, projectController.addProject);

export default router;
