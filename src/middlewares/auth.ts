import { NextFunction, Request, Response } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	if (req.session.userId) return next();
	res.status(401).json({
		success: false,
		message: "you need to be logged in to perform this action",
	});
};

export const hasProjectOpened = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.session.projectId) return next();
	res.status(401).json({
		success: false,
		message: "you need to have a open project to perform this action",
	});
};
