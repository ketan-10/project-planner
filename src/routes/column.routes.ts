import { Router } from "express";

import * as auth from "../middlewares/auth";
import * as validator from "../middlewares/validator";
import * as columnController from "../controllers/column.controller";

const router = Router();

router.use(auth.isLoggedIn);
router.use(auth.hasProjectOpened);

router.post("/", validator.validateColumnName, columnController.createColumn);
router.patch(
	"/:columnId",
	validator.validateColumnName,
	columnController.updateColumn
);

router.patch(
	"/swap",
	validator.validateColumnIndices,
	columnController.swapColumns
);

export default router;
