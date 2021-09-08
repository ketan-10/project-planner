import { BaseError } from "../errors/base.error";
import ColumnModel, { IColumn } from "../models/Column";
import * as projectService from "../services/project.service";

export const createColumn = async (
	projectId: string,
	columnName: string
): Promise<IColumn> => {
	try {
		const savedColumn = await ColumnModel.create({ columnName });
		await projectService.addColumnIdToProject(projectId, savedColumn._id);
		return savedColumn;
	} catch (err) {
		if (err instanceof BaseError) return Promise.reject(err);
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
	} catch (err) {
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
	} catch (err) {
		if (err instanceof BaseError) return Promise.reject(err);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};
