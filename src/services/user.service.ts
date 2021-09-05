import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import UserModel, { IUser } from "../models/User";
import log from "../util/logger";

export const saveUser = async (
	username: string,
	password: string
): Promise<IUser> => {
	const savedUser = await UserModel.create({
		username,
		password: await bcrypt.hash(password, 14),
	});
	return savedUser;
};

export const comparePassword = async (
	username: string,
	password: string
): Promise<string> => {
	const user = await UserModel.findOne({
		username: username,
	});
	if (!user) {
		return Promise.reject(null);
	}
	const isValid = await bcrypt.compare(password, user.password);
	return isValid ? user._id : null;
};

export const addProjectToUser = async (
	userId: string,
	projectId: string
): Promise<boolean> => {
	const updatedUser = await UserModel.findByIdAndUpdate(
		userId,
		{
			$push: {
				projectIds: projectId,
			},
		},
		{
			new: true,
		}
	);
	return updatedUser ? true : false;
};

export const deleteProject = async (
	userId: string,
	projectId: string
): Promise<boolean> => {
	const updatedUser = await UserModel.findByIdAndUpdate(
		userId,
		{
			$pull: {
				projectIds: new Types.ObjectId(projectId),
			},
		},
		{
			new: true,
		}
	);
	return updatedUser ? true : false;
};

export const getProjectIds = async (userId: string): Promise<Array<string>> => {
	const user = await UserModel.findById(userId);
	if (!user) {
		return Promise.reject(null);
	}
	return user?.projectIds;
};
