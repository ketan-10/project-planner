import { Router } from "express";

import * as projectController from "../controllers/project.controller";

const router = Router();

router.post("/", projectController.createProject);
router.patch("/:id", projectController.updateProjectName);
router.delete("/:id", projectController.deleteProject);

export default router;
