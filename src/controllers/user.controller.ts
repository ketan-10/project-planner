//TODO login, signup,  //handle validation

import { Request, Response } from "express";
import lodash from "lodash";

import * as userService from "../services/user.service";

export const signup = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	try {
		const savedUser = await userService.saveUser(username, password);
		return res.json({
			success: true,
			data: lodash.pick(savedUser.toJSON(), ["username", "createdAt"]),
		});
	} catch (err: any) {
		if (err.code === 11000) {
			//unique key error code
			return res.status(400).json({
				success: false,
				errors: ["duplicate username"],
			});
		}
		return res.sendStatus(500);
	}
};

export const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	const userId = await userService.comparePassword(username, password);
	if (userId) {
		req.session.userId = userId; //store userId in session
		return res.json({
			success: true,
			message: "logged in",
		});
	}
	return res.status(401).json({
		success: false,
		errors: ["invalid credentials"],
	});
};

export const logout = async (req: Request, res: Response) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				return res.sendStatus(500);
			}
			return res.status(200).json({
				success: true,
				message: "logged out successfully!",
			});
		});
	} catch (err) {
		return res.sendStatus(500);
	}
};
