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

import * as columnService from "../services/column.service";

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
