import { Request, Response } from "express";
import lodash from "lodash";

import * as columnService from "../services/column.service";

export const createColumn = async (req: Request, res: Response) => {
	try {
		const { columnName } = req.body;
		const column = await columnService.createColumn(
			req.session.projectId!,
			columnName
		);
		if (!req.session.columnIds) {
			req.session.columnIds = [];
		}
		req.session.columnIds.push(column._id);
		return res.sendSuccessWithData(column.toJSON());
	} catch (error) {
		return res.sendError(error);
	}
};

export const updateColumn = async (req: Request, res: Response) => {
	try {
		const { columnId } = req.params;
		const { columnName } = req.body;
		const updatedColumn = await columnService.updateColumn(
			columnId,
			columnName
		);
		return res.sendSuccessWithData(
			lodash.pick(updatedColumn.toJSON(), ["columnName"])
		);
	} catch (error) {
		return res.sendError(error);
	}
};

export const truncateColumn = async (req: Request, res: Response) => {
	try {
		const { columnId } = req.params;
		await columnService.truncateColumnById(columnId);
		return res.sendSuccess(`columnId ${columnId} truncated`);
	} catch (error) {
		return res.sendError(error);
	}
};

export const deleteColumn = async (req: Request, res: Response) => {
	try {
		const { columnId } = req.params;
		await columnService.deleteColumnById(columnId);
		req.session.columnIds?.splice(
			req.session.columnIds.indexOf(columnId),
			1
		);
		return res.sendSuccess(`columnId ${columnId} deleted`);
	} catch (error) {
		return res.sendError(error);
	}
};
