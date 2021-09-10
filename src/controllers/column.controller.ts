//TODO add, rename, delete && move one ticket to another column.
/**
 *
 * ? Add column:
 * id = create column
 * currentProjct.columns.append(id)
 *
 * ? rename column:
 * rename(id)
 *
 * ? delete column:
 * if(column.tickets.length >= 1) {
 *      for(t: tickets) {
 *          delete(t)
 *      }
 * }
 * id = deleteColumn(id)
 * currentProject.columns.deleteFromArray(id)
 *
 *
 * ? move ticket from x -> y:
 * tickets = getTickets(id)
 * move(xid <-> yid)
 *
 */

import { Request, Response } from "express";
import lodash from "lodash";
import { BaseError } from "../errors/base.error";

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
		return res.status(200).json({
			success: true,
			data: column,
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

export const updateColumn = async (req: Request, res: Response) => {
	try {
		const { columnId } = req.params;
		const { columnName } = req.body;
		const updatedColumn = await columnService.updateColumn(
			columnId,
			columnName
		);
		return res.status(200).json({
			success: true,
			data: lodash.pick(updatedColumn.toJSON(), ["columnName"]),
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

export const truncateColumn = async (req: Request, res: Response) => {
	try {
		const { columnId } = req.params;
		await columnService.truncateColumnById(columnId);
		return res.status(200).json({
			success: true,
			message: `columnId ${columnId} truncated`,
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

export const deleteColumn = async (req: Request, res: Response) => {
	try {
		const { columnId } = req.params;
		await columnService.deleteColumnById(columnId);
		req.session.columnIds?.splice(
			req.session.columnIds.indexOf(columnId),
			1
		);
		return res.status(200).json({
			success: true,
			message: `columnId ${columnId} deleted`,
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
