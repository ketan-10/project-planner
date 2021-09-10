import { Router } from "express";

import * as auth from "../middlewares/auth";
import * as validator from "../middlewares/validator";
import * as columnController from "../controllers/column.controller";

const router = Router();

router.use(auth.isLoggedIn);
router.use(auth.hasProjectOpened);

router.post(
	"/",
	validator.validatePresentInBody("columnName"),
	validator.validateCharacterLength("columnName", 50),
	columnController.createColumn
);
router.patch(
	"/:columnId",
	validator.validatePresentInBody("columnName"),
	validator.validateCharacterLength("columnName", 50),
	validator.validatePathParamPresent("columnId"),
	columnController.updateColumn
);

router.delete(
	"/:columnId",
	validator.validatePathParamPresent("columnId"),
	columnController.deleteColumn
);

router.delete(
	"/truncate/:columnId",
	validator.validatePathParamPresent("columnId"),
	columnController.truncateColumn
);

export default router;
