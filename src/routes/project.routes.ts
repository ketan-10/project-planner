import { Router } from "express";

import * as projectController from "../controllers/project.controller";
import * as validator from "../middlewares/validator";
import * as auth from "../middlewares/auth";

const router = Router();

router.use(auth.isLoggedIn);

router.post(
	"/",
	validator.validatePresentInBody("projectName"),
	validator.validateCharacterLength("projectName", 40),
	validator.validateCharacterLength("description", 600),
	projectController.addProject
);

router.get("/", projectController.getAllProjects);
router.get(
	"/:projectId",
	validator.validatePathParamPresent("projectId"),
	projectController.openProject
);

router.patch(
	"/:projectId",
	validator.validateCharacterLength("projectName", 40),
	validator.validateCharacterLength("description", 600),
	projectController.updateProject
);

router.delete("/:projectId", projectController.deleteProject);

router.post(
	"/state",
	auth.hasProjectOpened,
	validator.validatePresentInBody("state"),
	validator.validateProjectState,
	projectController.changeState
);

export default router;
