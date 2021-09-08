//TODO add, rename,get all projects, delete project, move column from x-> y
//TODO validation & error handling

import { Request, Response, NextFunction } from "express";
import lodash from "lodash";
import { BaseError } from "../errors/base.error";

import * as projectService from "../services/project.service";
import log from "../util/logger";

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
			lodash.pick(req.body, ["projectName", "description"]),
			req.session.userId!
		);
		return res.status(200).json({
			success: true,
			data: {
				projectId,
			},
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

export const getAllProjects = async (req: Request, res: Response) => {
	try {
		if (req.session.projectId) {
			req.session.projectId = null; //if has open project, close it.
		}
		const projects = await projectService.getUserProjects(
			req.session.userId!
		);
		return res.status(200).json({
			success: true,
			data: {
				projects,
			},
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

export const openProject = async (req: Request, res: Response) => {
	try {
		const { projectId } = req.params;
		const project = await projectService.getOneProject(projectId);
		req.session.projectId = project._id; //opened a project
		return res.status(200).json({
			status: 200,
			data: lodash.omit(project.toJSON(), ["__v", "userIds"]),
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

export const updateProject = async (req: Request, res: Response) => {
	try {
		const { projectId } = req.params;
		const { projectName, description } = req.body;
		const updatedProject = await projectService.updateProject(projectId, {
			projectName,
			description,
		});
		return res.status(200).json({
			success: true,
			data: lodash.pick(updatedProject, ["projectName", "description"]),
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

export const deleteProject = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	try {
		const result = await projectService.deleteProject(
			req.session.userId!,
			projectId
		);
		if (req.session.projectId === projectId) {
			req.session.projectId = null; //if project is open, close it.
		}
		return res.status(200).json({
			success: true,
			data: lodash.pick(result.toJSON(), [
				"_id",
				"projectName",
				"description",
			]),
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

export const closeProject = async (req: Request, res: Response) => {
	try {
		req.session.projectId = null;
		return res.status(200).json({
			success: true,
			message: "project closed",
		});
	} catch (error) {
		return res.sendStatus(500);
	}
};
