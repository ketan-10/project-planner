import { Router } from "express";

import * as ticketController from "../controllers/ticket.controller";
import * as auth from "../middlewares/auth";
import * as validator from "../middlewares/validator";

const router = Router();

router.use(auth.isLoggedIn);
router.use(auth.hasProjectOpened);

router.post(
	"/",
	validator.validatePresentInBody("title"),
	validator.validateCharacterLength("title", 80),
	validator.validateCharacterLength("description", 400),
	ticketController.createTicket
);

router.patch(
	"/:ticketId",
	validator.validatePathParamPresent("ticketId"),
	validator.validateCharacterLength("title", 80),
	validator.validateCharacterLength("description", 400),
	ticketController.updateTicket
);

// delete one ticket
router.delete(
	"/:ticketId",
	validator.validatePathParamPresent("ticketId"),
	ticketController.deleteOneTicket
);

export default router;
