//TODO add, rename,get all projects, delete project, move column from x-> y
//TODO validation & error handling

import { Request, Response } from "express";
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

export const createProject = async (req: Request, res: Response) => {
	const { projectName, description } = req.body;
	const savedProject = await projectService.createProject({
		projectName,
		description,
	});
	return res.status(201).json(savedProject);
};

export const updateProjectName = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { projectName } = req.body;
	const updatedProject = await projectService.updateName(id, projectName);
	return res.status(200).json(updatedProject);
};

export const deleteProject = async (req: Request, res: Response) => {
	const { id } = req.params;
	const deletedProject = await projectService.deleteProject(id);
	return res.status(200).json(deletedProject);
};
