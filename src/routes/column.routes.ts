import { Router } from "express";

import * as auth from "../middlewares/auth";
import * as validator from "../middlewares/validator";
import * as columnController from "../controllers/column.controller";

const router = Router();

router.use(auth.isLoggedIn);
router.use(auth.hasProjectOpened);

router.post("/", validator.validateColumnName, columnController.createColumn);

export default router;
