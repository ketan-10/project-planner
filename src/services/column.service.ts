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
