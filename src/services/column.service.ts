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
		return Promise.reject(err);
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
			return Promise.reject(null);
		}
		return updatedColumn;
	} catch (err) {
		return Promise.reject(err);
	}
};
