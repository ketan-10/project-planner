import { ITicket } from "../models/Ticket";
import TicketModel from "../models/Ticket";
import { BaseError } from "../errors/base.error";
import * as columnService from "../services/column.service";

export const createTicket = async (
	columnId: string,
	ticket: Partial<ITicket>
): Promise<string> => {
	try {
		const savedTicket = await TicketModel.create(ticket);
		await columnService.addTicketIdToColumn(columnId, savedTicket._id);
		return savedTicket._id;
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const updateTicket = async (
	ticketId: string,
	ticket: Partial<ITicket>
): Promise<ITicket> => {
	try {
		const updatedTicket = await TicketModel.findByIdAndUpdate(
			ticketId,
			ticket,
			{
				new: true,
			}
		);
		if (!updatedTicket) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `ticketId ${ticketId} not found`,
				})
			);
		}
		return updatedTicket;
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};
