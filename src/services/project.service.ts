import { BaseError } from "../errors/base.error";
import ProjectModel, { IProject } from "../models/Project";
import * as userService from "../services/user.service";
import log from "../util/logger";

export const getUserProjects = async (
	userId: string
): Promise<Array<IProject>> => {
	try {
		const projectIds = await userService.getProjectIds(userId);
		if (!projectIds) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: "userId not found",
				})
			);
		}
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
		return Promise.resolve(projects);
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const getOneProject = async (projectId: string): Promise<IProject> => {
	try {
		const project = await ProjectModel.findById(projectId);
		if (!project) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `projectId ${projectId} not found`,
				})
			);
		}
		return Promise.resolve(project);
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const createProject = async (
	project: Partial<IProject>,
	userId: string
): Promise<string> => {
	try {
		const savedProject = await ProjectModel.create({
			...project,
			userIds: [userId],
		});
		await userService.addProjectIdToUser(userId, savedProject._id);
		return savedProject._id;
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		//TODO add rollback if userService fails
		return Promise.reject(new BaseError({ statusCode: 500 }));
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
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `projectId ${projectId} not found`,
				})
			);
		}
		return updatedProject;
	} catch (error) {
		return Promise.reject(
			new BaseError({
				statusCode: 500,
			})
		);
	}
};

export const deleteProject = async (
	userId: string,
	projectId: string
): Promise<IProject> => {
	try {
		await userService.deleteProjectId(userId, projectId);
		//TODO delete column documents.
		const deletedProject = await ProjectModel.findByIdAndDelete(projectId);
		if (!deletedProject) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `projectId ${projectId} not found`,
				})
			);
		}
		return deletedProject;
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const addUser = async (
	userId: string,
	projectId: string
): Promise<boolean> => {
	try {
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
		if (!updatedProject) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `projectId ${projectId} not found`,
				})
			);
		}
		return true;
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
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
		if (!updatedProject) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `projectId ${projectId} not found`,
				})
			);
		}
		return updatedProject?.columnIds.includes(columnId)
			? Promise.resolve(true)
			: Promise.reject(false);
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const deleteColumn = async () => {};

export const swapColumns = async (
	projectId: string,
	firstIndex: number,
	secondIndex: number
): Promise<Array<string>> => {
	try {
		const project = await ProjectModel.findById(projectId);
		if (!project) {
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `projectId ${projectId} not found`,
				})
			);
		}
		const columnIds = project.columnIds;
		if (firstIndex < columnIds.length && secondIndex < columnIds.length) {
			[columnIds[firstIndex], columnIds[secondIndex]] = [
				columnIds[secondIndex],
				columnIds[firstIndex],
			];
			await ProjectModel.findByIdAndUpdate(projectId, {
				columnIds,
			});
			return columnIds;
		} else {
			return Promise.reject(
				new BaseError({
					statusCode: 400,
					description:
						"first, and second indices must be less than number of columns",
				})
			);
		}
	} catch (error) {
		if (error instanceof BaseError) return Promise.reject(error);
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};
