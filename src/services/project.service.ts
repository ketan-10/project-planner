import ProjectModel, { IProject } from "../models/Project";
import * as userService from "../services/user.service";
import log from "../util/logger";

export const getUserProjects = async (
	userId: string
): Promise<Array<Partial<IProject>>> => {
	try {
		const projectIds = await userService.getProjectIds(userId);
		const projects = await ProjectModel.find(
			{
				_id: {
					$in: projectIds,
				},
			},
			{
				projectName: 1,
				projectDescription: 1,
			}
		);
		return projects;
	} catch (err) {
		return Promise.reject(null);
	}
};

export const getOneProject = async (projectId: string): Promise<IProject> => {
	try {
		const project = await ProjectModel.findById(projectId);
		return project!;
	} catch (err) {
		return Promise.reject(null);
	}
};

export const createProject = async (
	project: object,
	userId: string
): Promise<string> => {
	try {
		const savedProject = await ProjectModel.create({
			...project,
			userIds: [userId],
		});
		await userService.addProjectIdToUser(userId, savedProject._id);
		return savedProject._id;
	} catch (err) {
		return Promise.reject("error in creating project");
	}
};

export const updateProject = async (
	projectId: string,
	project: Partial<IProject>
): Promise<Partial<IProject>> => {
	try {
		const updatedProject = await ProjectModel.findByIdAndUpdate(
			projectId,
			project,
			{
				new: true,
			}
		);
		if (!updatedProject) {
			return Promise.reject(null);
		}
		return updatedProject;
	} catch (err) {
		return Promise.reject(null);
	}
};

export const deleteProject = async (
	userId: string,
	projectId: string
): Promise<Partial<IProject>> => {
	try {
		const isProjectIdDeleted = await userService.deleteProjectId(
			userId,
			projectId
		);
		if (!isProjectIdDeleted) {
			return Promise.reject(null);
		}

		//TODO delete column documents.
		const deletedProject = await ProjectModel.findByIdAndDelete(projectId);
		if (!deletedProject) {
			return Promise.reject(null);
		}
		return deletedProject;
	} catch (err) {
		return Promise.reject(err);
	}
};

export const addUser = async (
	userId: string,
	projectId: string
): Promise<boolean> => {
	const updatedProject = await ProjectModel.findByIdAndUpdate(
		projectId,
		{
			$push: {
				userIds: userId,
			},
		},
		{
			new: true,
		}
	);
	return updatedProject ? true : false;
};

export const removeUser = async () => {};

export const addColumn = async () => {};

export const deleteColumn = async () => {};

export const swapColumns = async () => {};
