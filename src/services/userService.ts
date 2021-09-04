import bcrypt from "bcryptjs";

import UserModel, { IUser } from "../models/UserModel";

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
