import ProjectModel, { IProject } from "../models/Project";
import * as userService from "../services/user.service";
import log from "../util/logger";

export const getUserProjects = async (
	userId: string
): Promise<Array<IProject>> => {
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
		if (!project) {
			return Promise.reject(null);
		}
		return project;
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
): Promise<IProject> => {
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
): Promise<IProject> => {
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

export const addColumnIdToProject = async (
	projectId: string,
	columnId: string
): Promise<boolean> => {
	try {
		const updatedProject = await ProjectModel.findByIdAndUpdate(
			projectId,
			{
				$push: {
					columnIds: columnId,
				},
			},
			{
				new: true,
			}
		);
		return updatedProject?.columnIds.includes(columnId)
			? Promise.resolve(true)
			: Promise.reject(false);
	} catch (err) {
		return Promise.reject(false);
	}
};

export const deleteColumn = async () => {};

export const swapColumns = async (
	projectId: string,
	fromIndex: number,
	toIndex: number
): Promise<Array<string>> => {
	try {
		const project = await ProjectModel.findById(projectId);
		if (!project) return Promise.reject(null);
		const columnIds = project.columnIds;
		if (fromIndex < columnIds.length && toIndex < columnIds.length) {
			const tmp = columnIds[fromIndex];
			columnIds[fromIndex] = columnIds[toIndex];
			columnIds[toIndex] = tmp;
			await ProjectModel.findByIdAndUpdate(projectId, {
				columnIds,
			});
			return columnIds;
		} else {
			return Promise.reject(null); //TODO handle diffrent types of errors.
		}
	} catch (err) {
		return Promise.reject(err);
	}
};
