import { Request, Response } from "express";
import lodash from "lodash";
import { BaseError } from "../errors/base.error";

import * as userService from "../services/user.service";
import log from "../util/logger";

export const signup = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	try {
		const savedUser = await userService.saveUser(username, password);
		return res.sendSuccessWithData(
			lodash.pick(savedUser.toJSON(), ["username", "createdAt"])
		);
	} catch (error) {
		return res.sendError(error);
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
		const userId = await userService.comparePassword(username, password);
		req.session.userId = userId; //store userId in session
		return res.sendSuccess("logged in");
	} catch (error) {
		return res.sendError(error);
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		req.session.destroy((error) => {
			if (error) {
				return res.sendStatus(500);
			}
			res.clearCookie("connect.sid"); //clear coookie
			return res.sendSuccess("logged out successfully");
		});
	} catch (error) {
		return res.sendError(error);
	}
};
