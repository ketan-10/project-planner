import { BaseError } from "../errors/base.error";
import ColumnModel, { IColumn } from "../models/Column";
import * as projectService from "../services/project.service";
import log from "../util/logger";

export const createColumn = async (
	projectId: string,
	columnName: string
): Promise<IColumn> => {
	try {
		const savedColumn = await ColumnModel.create({ columnName });
		await projectService.addColumnIdToProject(projectId, savedColumn._id);
		return savedColumn;
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const getColumnByColumnId = async (
	columnId: string
): Promise<IColumn> => {
	try {
		const column = await ColumnModel.findById(columnId);
		if (!column) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		return column;
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const updateColumn = async (
	columnId: string,
	columnName: string
): Promise<IColumn> => {
	try {
		const updatedColumn = await ColumnModel.findByIdAndUpdate(
			columnId,
			{
				columnName,
			},
			{
				new: true,
			}
		);
		if (!updatedColumn) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		return updatedColumn;
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const addTicketIdToColumn = async (
	columnId: string,
	ticketId: string
): Promise<IColumn> => {
	try {
		const updatedColumn = await ColumnModel.findByIdAndUpdate(
			columnId,
			{
				$push: {
					ticketIds: ticketId,
				},
			},
			{
				new: true,
			}
		);
		if (!updatedColumn) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		return updatedColumn;
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const swapTicketsInSameColumn = async (
	columnId: string,
	firstIndex: number,
	secondIndex: number
): Promise<Array<string>> => {
	try {
		const column = await ColumnModel.findById(columnId);
		if (!column) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		const ticketIds = column.ticketIds;
		if (firstIndex < ticketIds.length && secondIndex < ticketIds.length) {
			[ticketIds[firstIndex], ticketIds[secondIndex]] = [
				ticketIds[secondIndex],
				ticketIds[firstIndex],
			];
			await ColumnModel.findByIdAndUpdate(columnId, {
				ticketIds,
			});
			return ticketIds;
		} else {
			return Promise.reject(
				new BaseError({
					statusCode: 400,
					description:
						"first, and second indices must be less than number of tickets",
				})
			);
		}
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const moveticketAcrossColumns = async (
	columnFromId: string,
	columnToId: string,
	ticketIndex: number,
	ticketId: string
): Promise<boolean> => {
	try {
		const [columnFrom, columnTo]: IColumn[] = await Promise.all([
			getColumnByColumnId(columnFromId),
			getColumnByColumnId(columnToId),
		]);
		if (!columnFrom.ticketIds.includes(ticketId)) {
			return Promise.reject(
				new BaseError({
					statusCode: 400,
					description: `ticketId ${ticketId} not present in columnId ${columnFromId}`,
				})
			);
		}
		if (ticketIndex > columnTo.ticketIds.length) {
			return Promise.reject(
				new BaseError({
					statusCode: 400,
					description: `ticketIndex ${ticketIndex} should be less than or equal to target ticket size`,
				})
			);
		}
		const deleteFromColumn = ColumnModel.findByIdAndUpdate(
			columnFromId,
			{
				ticketIds: columnFrom.ticketIds.filter(
					(tktid) => tktid.toString() !== ticketId
				),
			},
			{
				new: true,
			}
		);

		const updatedTickets = columnTo.ticketIds;
		if (ticketIndex === updatedTickets.length) {
			updatedTickets.push(ticketId);
		} else {
			updatedTickets.splice(ticketIndex, 0, ticketId);
		}

		const updateToColumn = ColumnModel.findByIdAndUpdate(
			columnToId,
			{
				ticketIds: updatedTickets,
			},
			{
				new: true,
			}
		);
		await Promise.all([deleteFromColumn, updateToColumn]);
		return true;
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};
