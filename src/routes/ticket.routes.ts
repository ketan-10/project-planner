import { Router } from "express";

import * as ticketController from "../controllers/ticket.controller";
import * as auth from "../middlewares/auth";
import * as validator from "../middlewares/validator";

const router = Router();

router.use(auth.isLoggedIn);
router.use(auth.hasProjectOpened);

router.post(
	"/",
	validator.validateColumnIdPresent,
	validator.validateTicketTitlePresent,
	validator.validateTicketTitleAndDescription,
	ticketController.createTicket
);

router.patch(
	"/:ticketId",
	validator.validateTicketTitleAndDescription,
	ticketController.updateTicket
);

// delete one ticket
router.delete("/:ticketId", ticketController.deleteOneTicket);

export default router;
