//TODO add, rename, delete ticket
/**
 * ?self explanatory
 */

import { Request, Response } from "express";

import { BaseError } from "../errors/base.error";
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
		return res.status(200).json({
			success: true,
			data: { ticketId },
		});
	} catch (error) {
		if (error instanceof BaseError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.description,
			});
		}
		return res.sendStatus(500);
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
		return res.status(200).json({
			success: true,
			data: updatedTicket,
		});
	} catch (error) {
		if (error instanceof BaseError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.description,
			});
		}
		return res.sendStatus(500);
	}
};

export const swapTickets = async (req: Request, res: Response) => {
	try {
		const { columnId, firstIndex, secondIndex } = req.body;
		const updatedTicketIds = await columnService.swapTicketsInSameColumn(
			columnId,
			firstIndex,
			secondIndex
		);
		return res.status(200).json({
			success: true,
			data: {
				updatedTicketIds,
			},
		});
	} catch (error) {
		if (error instanceof BaseError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.description,
			});
		}
		return res.sendStatus(500);
	}
};

export const moveTicketAcrossColumns = async (req: Request, res: Response) => {
	try {
		const { ticketId } = req.params;
		const { targetColumnId, ticketIndex } = req.body;
		await columnService.moveticketAcrossColumns(
			targetColumnId,
			ticketIndex,
			ticketId
		);
		return res.status(200).json({
			success: true,
			message: `ticketId ${ticketId} moved to column ${targetColumnId} at index ${ticketIndex}`,
		});
	} catch (error) {
		if (error instanceof BaseError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.description,
			});
		}
		return res.sendStatus(500);
	}
};

export const deleteOneTicket = async (req: Request, res: Response) => {
	try {
		const { ticketId } = req.params;
		await columnService.deleteOneTicket(ticketId);
		return res.status(200).json({
			success: true,
			message: `ticketId ${ticketId} removed`,
		});
	} catch (error) {
		if (error instanceof BaseError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.description,
			});
		}
		return res.sendStatus(500);
	}
};
