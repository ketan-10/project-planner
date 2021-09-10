import { Router } from "express";

import * as projectController from "../controllers/project.controller";
import * as validator from "../middlewares/validator";
import * as auth from "../middlewares/auth";

const router = Router();

router.use(auth.isLoggedIn);

router.post(
	"/",
	validator.validateProjectNamePresent,
	validator.validateProjectNameAndDescription,
	projectController.addProject
);

router.get("/", projectController.getAllProjects);
router.get("/:projectId", projectController.openProject);

router.patch(
	"/:projectId",
	validator.validateProjectNameAndDescription,
	projectController.updateProject
);

router.delete("/:projectId", projectController.deleteProject);

//TODO add serssion validator:
router.post("/state", auth.hasProjectOpened, projectController.changeState);

export default router;
