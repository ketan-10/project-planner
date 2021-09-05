//TODO add, rename,get all projects, delete project, move column from x-> y
//TODO validation & error handling

import { Request, Response, NextFunction } from "express";
import lodash from "lodash";

import * as projectService from "../services/project.service";

/**
 * ?Add project:
 * id = model.add(project)
 *
 * ?Rename project:
 * id = model.update(project)
 *
 * ?Delete project:
 * for(c: columns) {
 *      delete(c)
 * }
 * model.delete(project)
 *
 * ?Move column x->y
 * columns = model.get(projId)
 * columns[x <--> y]
 *
 * ?Open & close project(delete from session)
 *
 */

export const addProject = async (req: Request, res: Response) => {
	try {
		const projectId = await projectService.createProject(
			lodash.pick(req.body, ["projectName", "projectDescription"]),
			req.session.userId!
		);
		if (projectId) {
			return res.status(200).json({
				success: true,
				data: {
					projectId,
				},
			});
		} else {
			return res.sendStatus(500);
		}
	} catch (err) {
		return res.sendStatus(500);
	}
};
