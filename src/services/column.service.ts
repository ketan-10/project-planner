import { Types } from "mongoose";
import { BaseError } from "../errors/base.error";
import ColumnModel, { IColumn } from "../models/Column";
import * as projectService from "../services/project.service";
import * as ticketService from "../services/ticket.service";
import log from "../util/logger";

export const createColumn = async (
	projectId: string,
	columnName: string
): Promise<IColumn> => {
	try {
		const savedColumn = await ColumnModel.create({ columnName, projectId });
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

export const getManyColumnsById = async (
	columnIds: string[]
): Promise<IColumn[]> => {
	try {
		const columns = await ColumnModel.find({
			_id: {
				$in: columnIds,
			},
		});
		if (!columns) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `columns not found`,
				})
			);
		}
		return columns;
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

export const moveTickets = async (columns: IColumn[]): Promise<any> => {
	try {
		if (!columns) return Promise.resolve([]);
		const updatedColumns = await Promise.all(
			columns.map((column) => {
				return ColumnModel.findByIdAndUpdate(
					column._id,
					{
						ticketIds: column.ticketIds,
					},
					{
						new: true,
					}
				);
			})
		);
		await Promise.all(
			columns.map((column) => {
				return ticketService.updateManyColumnIds(
					column.ticketIds,
					column._id
				);
			})
		);
		return updatedColumns;
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const deleteOneTicket = async (ticketId: string): Promise<boolean> => {
	try {
		const ticket = await ticketService.getTicketById(ticketId);
		const updatedColumn = await ColumnModel.findByIdAndUpdate(
			ticket.columnId.toString(),
			{
				$pull: {
					ticketIds: new Types.ObjectId(ticketId),
				},
			},
			{ new: true }
		);
		if (!updatedColumn) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `columnId ${ticket.columnId.toString()} not found`,
				})
			);
		}
		if (updatedColumn.ticketIds.includes(ticketId)) {
			return Promise.reject(new BaseError({ statusCode: 500 }));
		}
		await ticketService.deleteOneTicketById(ticketId);
		return true;
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const truncateColumnById = async (
	columnId: string
): Promise<boolean> => {
	try {
		const column = await ColumnModel.findByIdAndUpdate(
			columnId,
			{
				ticketIds: [],
			},
			{
				new: false,
			}
		);
		if (!column) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		await ticketService.deleteManyTicketsByIds(column.ticketIds);
		return true;
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const deleteColumnById = async (columnId: string): Promise<boolean> => {
	try {
		const column = await ColumnModel.findByIdAndDelete(columnId);
		if (!column) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		await ticketService.deleteManyTicketsByIds(column.ticketIds);
		await projectService.deleteColumnIdFromProject(
			column.projectId,
			columnId
		);
		return true;
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const deleteManyColumnsById = async (
	columnIds: string[]
): Promise<boolean> => {
	try {
		const deletedColumns = await Promise.all(
			columnIds.map((columnId) => {
				return ColumnModel.findByIdAndDelete(columnId);
			})
		);
		await Promise.all(
			deletedColumns.map((column) =>
				ticketService.deleteManyTicketsByIds(column?.ticketIds!)
			)
		);
		return true;
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};
