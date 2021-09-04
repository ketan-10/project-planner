//TODO login, signup,  //handle validation

import { Request, Response } from "express";
import lodash from "lodash";

import * as userService from "../services/userService";

export const signup = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	if (!(username && password)) {
		return res.status(400).json({
			success: false,
			message: "username or password cannot be empty",
		});
	}
	try {
		const savedUser = await userService.saveUser(username, password);
		return res.json({
			success: true,
			data: lodash.pick(savedUser.toJSON(), ["username", "createdAt"]),
		});
	} catch (err: any) {
		if (err.code === 11000) {
			return res.status(400).json({
				success: false,
				message: "duplicate username",
			});
		}
		return res.sendStatus(500);
	}
};

export const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	if (!(username && password)) {
		return res.status(400).json({
			success: false,
			message: "username or password cannot be empty",
		});
	}
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
		message: "invalid credentials",
	});
};
