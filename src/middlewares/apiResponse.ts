import { NextFunction, Request, Response } from "express";
import { BaseError } from "../errors/base.error";

export const apiResponse = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.sendSuccess = (message: string) => {
		return res.status(200).json({
			success: true,
			message,
		});
	};
	res.sendSuccessWithData = (data: object) => {
		return res.status(200).json({
			success: true,
			data,
		});
	};
	res.sendFailure = (error: any) => {
		if (error instanceof BaseError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.description,
			});
		}
		return res.status(500).json({
			success: false,
			message: "Internal Server Error.",
		});
	};
	res.sendValidationErrors = (errors: object) => {
		return res.status(400).json({
			success: false,
			errors,
		});
	};
	return next();
};
