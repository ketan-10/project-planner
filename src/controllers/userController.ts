import { Request, Response } from "express";

import UserModel from "../models/UserModel";

export const saveUser = async (req: Request, res: Response) => {
	const result = await UserModel.create(req.body);
	res.json(result);
};
