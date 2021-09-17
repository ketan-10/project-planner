import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { BaseError } from "../errors/base.error";
import { APIResponse } from "../types/APIResponse";

export const apiresponse = (
	_req: Request,
	res: Response<APIResponse>,
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

	res.sendError = (error: any) => {
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

	res.sendAPIStatus = (statusCode: number) => {
		const statusClass = status[`${statusCode}_CLASS`] as string;
		const message = status[statusCode] as string;
		return res.status(statusCode).json({
			success: statusClass === "2xx",
			message,
		});
	};

	res.sendBadRequest = (message: string) => {
		return res.status(400).json({
			success: false,
			message,
		});
	};

	return next();
};
