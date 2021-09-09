import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { BaseError } from "../errors/base.error";

import UserModel, { IUser } from "../models/User";
import log from "../util/logger";

export const saveUser = async (
	username: string,
	password: string
): Promise<IUser> => {
	try {
		const savedUser = await UserModel.create({
			username,
			password: await bcrypt.hash(password, 14),
		});
		return savedUser;
	} catch (error: any) {
		if (error.code === 11000) {
			//unique key error code
			return Promise.reject(
				new BaseError({
					statusCode: 400,
					description: "duplicate username",
				})
			);
		}
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const comparePassword = async (
	username: string,
	password: string
): Promise<string> => {
	try {
		const user = await UserModel.findOne({
			username: username,
		});
		if (!user) {
			return Promise.reject(new BaseError({ statusCode: 404 }));
		}
		const isValid = await bcrypt.compare(password, user?.password);
		return isValid
			? Promise.resolve(user._id)
			: Promise.reject(
					new BaseError({
						statusCode: 401,
						description: "Incorrect credentials",
					})
			  );
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
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
		if (!updatedUser) {
			return Promise.reject(new BaseError({ statusCode: 404 }));
		}
		return updatedUser?.projectIds.includes(projectId)
			? Promise.resolve(true)
			: Promise.reject(false);
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
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
		if (!updatedUser)
			return Promise.reject(
				new BaseError({
					statusCode: 404,
					description: `userId ${userId} not found`,
				})
			);
		return updatedUser.projectIds.includes(projectId)
			? Promise.reject(false)
			: Promise.resolve(true);
	} catch (error) {
		return Promise.reject(new BaseError({ statusCode: 500 }));
	}
};

export const getProjectIds = async (userId: string): Promise<Array<string>> => {
	const user = await UserModel.findById(userId);
	if (!user) {
		return Promise.reject(null);
	}
	return user.projectIds;
};
