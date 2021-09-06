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

import * as columnService from "../services/column.service";
import * as projectService from "../services/project.service";
import log from "../util/logger";

export const createColumn = async (req: Request, res: Response) => {
	try {
		const { columnName } = req.body;
		const column = await columnService.createColumn(
			req.session.projectId!,
			columnName
		);
		return res.status(200).json({
			success: true,
			data: column,
		});
	} catch (err) {
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
	} catch (err) {
		if (!err) return res.sendStatus(404);
		return res.sendStatus(500);
	}
};

export const swapColumns = async (req: Request, res: Response) => {
	try {
		const { fromIndex, toIndex } = req.body;
		const columnIds = await projectService.swapColumns(
			req.session.projectId!,
			fromIndex,
			toIndex
		);
		return res.status(200).json({
			success: true,
			data: {
				columnIds,
			},
		});
	} catch (err) {
		return res.sendStatus(500);
	}
};
