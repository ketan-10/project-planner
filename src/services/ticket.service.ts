import { ITicket } from "../models/Ticket";
import TicketModel from "../models/Ticket";
import { BaseError } from "../errors/base.error";
import * as columnService from "../services/column.service";

export const createTicket = async (
	columnId: string,
	ticket: Partial<ITicket>
): Promise<string> => {
	try {
		const savedTicket = await TicketModel.create({ ...ticket, columnId });
		await columnService.addTicketIdToColumn(columnId, savedTicket._id);
		return savedTicket._id;
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
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

export const getTicketById = async (ticketId: string): Promise<ITicket> => {
	try {
		const ticket = await TicketModel.findById(ticketId);
		if (!ticket) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `ticketId ${ticketId} not found`,
				})
			);
		}
		return ticket;
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const updateColumnId = async (
	ticketId: string,
	columnId: string
): Promise<boolean> => {
	try {
		const updatedTicket = await TicketModel.findByIdAndUpdate(
			ticketId,
			{
				columnId,
			},
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
		return true;
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const deleteManyTicketsByIds = async (
	ticketIds: string[]
): Promise<boolean> => {
	try {
		const deletedTickets = await TicketModel.deleteMany({
			_id: {
				$in: ticketIds,
			},
		});
		if (!deletedTickets) {
			new BaseError({
				statusCode: 404,
				description: "ticketIds not found",
			});
		}
		return true;
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const deleteOneTicketById = async (
	ticketId: string
): Promise<boolean> => {
	try {
		const deletedTicket = await TicketModel.findByIdAndDelete(ticketId);
		if (!deletedTicket) {
			new BaseError({
				statusCode: 404,
				description: `ticketId ${ticketId} not found`,
			});
		}
		return true;
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};
