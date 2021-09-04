import { NextFunction, Request, Response } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	if (req.session.isLoggedIn) next();
	res.status(401).json({
		success: false,
		message: "you need to be logged in to perform this action",
	});
};
