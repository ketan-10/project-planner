import { Request, Response } from "express";
import lodash from "lodash";

import * as projectService from "../services/project.service";
import log from "../util/logger";

export const addProject = async (req: Request, res: Response) => {
	try {
		const projectId = await projectService.createProject(
			lodash.pick(req.body, ["projectName", "description"]),
			req.session.userId!
		);
		return res.sendSuccessWithData({ projectId });
	} catch (error) {
		return res.sendError(error);
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
		return res.sendSuccessWithData({ projects });
	} catch (error) {
		return res.sendError(error);
	}
};

export const openProject = async (req: Request, res: Response) => {
	try {
		const { projectId } = req.params;
		const assembledProject = await projectService.openProject(projectId);
		req.session.projectId = assembledProject.project._id; //opened a project
		return res.sendSuccessWithData(assembledProject);
	} catch (error) {
		return res.sendError(error);
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
		return res.sendSuccessWithData(
			lodash.pick(updatedProject, ["projectName", "description"])
		);
	} catch (error) {
		return res.sendError(error);
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
		req.session.columnIds = [];
		req.session.ticketIds = [];
		return res.sendSuccessWithData(
			lodash.pick(result.toJSON(), ["_id", "projectName", "description"])
		);
	} catch (error) {
		return res.sendError(error);
	}
};

export const closeProject = async (req: Request, res: Response) => {
	try {
		req.session.projectId = null;
		return res.sendSuccess("project closed");
	} catch (error) {
		return res.sendError(error);
	}
};

export const changeState = async (req: Request, res: Response) => {
	try {
		const { state } = req.body;
		const updatedState = await projectService.changeState(
			req.session.projectId!,
			state
		);
		return res.sendSuccessWithData(updatedState);
	} catch (error) {
		return res.sendError(error);
	}
};
