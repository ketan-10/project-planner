//TODO login, signup,  //handle validation

import { Request, Response } from "express";
import lodash from "lodash";
import { BaseError } from "../errors/base.error";

import * as userService from "../services/user.service";
import log from "../util/logger";

export const signup = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	try {
		const savedUser = await userService.saveUser(username, password);
		return res.json({
			success: true,
			data: lodash.pick(savedUser.toJSON(), ["username", "createdAt"]),
		});
	} catch (error: any) {
		if (error instanceof BaseError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.description,
			});
		}
		return res.sendStatus(500);
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
		const userId = await userService.comparePassword(username, password);
		req.session.userId = userId; //store userId in session
		return res.json({
			success: true,
			message: "logged in",
		});
	} catch (error) {
		if (error instanceof BaseError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.description,
			});
		}
		return res.sendStatus(500);
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				return res.sendStatus(500);
			}
			res.clearCookie("connect.sid"); //clear coookie
			return res.status(200).json({
				success: true,
				message: "logged out successfully!",
			});
		});
	} catch (err) {
		return res.sendStatus(500);
	}
};
