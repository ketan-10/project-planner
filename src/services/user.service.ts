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
	return isValid ? Promise.resolve(user._id) : Promise.reject(null);
};

export const addProjectIdToUser = async (
	userId: string,
	projectId: string
): Promise<boolean> => {
	try {
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
		return updatedUser?.projectIds.includes(projectId)
			? Promise.resolve(true)
			: Promise.reject(false);
	} catch (err) {
		return Promise.reject(false);
	}
};

export const deleteProjectId = async (
	userId: string,
	projectId: string
): Promise<boolean> => {
	try {
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
		if (!updatedUser) return Promise.reject(false);
		return updatedUser.projectIds.includes(projectId)
			? Promise.reject(false)
			: Promise.resolve(true);
	} catch (err) {
		return Promise.reject(false);
	}
};

export const getProjectIds = async (userId: string): Promise<Array<string>> => {
	const user = await UserModel.findById(userId);
	if (!user) {
		return Promise.reject(null);
	}
	return user.projectIds;
};
