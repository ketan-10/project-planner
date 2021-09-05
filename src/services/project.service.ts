import ProjectModel from "../models/Project";
import * as userService from "../services/user.service";

export const createProject = async (
	project: object,
	userId: string
): Promise<string> => {
	try {
		const savedProject = await ProjectModel.create({
			...project,
			userIds: [userId],
		});
		await userService.addProjectToUser(userId, savedProject._id);
		return savedProject._id;
	} catch (err) {
		return Promise.reject("error in creating project");
	}
};

export const updateProject = async () => {};

export const deleteProject = async () => {};

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
