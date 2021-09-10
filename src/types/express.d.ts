import { Response } from "express";
import { IResponse } from "../models/IResponse";
import { IUser } from "../models/User";

declare global {
	namespace Express {
		export interface Request {
			user: IUser;
			userId: string;
			projectId: string;
		}
		export interface Response {
			sendSuccess(message: string): Response<IResponse>;
			sendSuccessWithData(data: object): Response<IResponse>;
			sendError(error: any): Response<IResponse>;
			sendValidationErrors(errors: object): Response<IResponse>;
			sendAPIStatus(statusCode: number): Response<IResponse>;
			sendBadRequest(message: string): Response<IResponse>;
		}
	}
}
