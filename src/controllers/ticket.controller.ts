import { Request, Response } from "express";

import * as ticketService from "../services/ticket.service";
import * as columnService from "../services/column.service";
import log from "../util/logger";

export const createTicket = async (req: Request, res: Response) => {
	try {
		const { columnId, title, description } = req.body;
		const ticketId = await ticketService.createTicket(columnId, {
			title,
			description,
		});
		if (!req.session.ticketIds) {
			req.session.ticketIds = [];
		}
		req.session.ticketIds.push(ticketId);
		return res.sendSuccessWithData({ ticketId });
	} catch (error) {
		return res.sendError(error);
	}
};

export const updateTicket = async (req: Request, res: Response) => {
	try {
		const { ticketId } = req.params;
		const { title, description } = req.body;
		const updatedTicket = await ticketService.updateTicket(ticketId, {
			title,
			description,
		});
		return res.sendSuccessWithData(updatedTicket.toJSON());
	} catch (error) {
		return res.sendError(error);
	}
};

export const deleteOneTicket = async (req: Request, res: Response) => {
	try {
		const { ticketId } = req.params;
		await columnService.deleteOneTicket(ticketId);
		req.session.ticketIds?.splice(
			req.session.ticketIds.indexOf(ticketId),
			1
		);
		return res.sendSuccess(`ticketId ${ticketId} removed`);
	} catch (error) {
		return res.sendError(error);
	}
};
