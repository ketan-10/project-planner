import { Response, Send } from "express";
import { AppResponse } from "./AppResponse";
import { IUser } from "../models/User";

declare global {
	namespace Express {
		export interface Request {
			user: IUser;
			userId: string;
			projectId: string;
		}
		export interface Response {
			sendSuccess(message: string): Response<AppResponse>;
			sendSuccessWithData(data: object): Response<AppResponse>;
			sendError(error: any): Response<AppResponse>;
			sendValidationErrors(errors: object): Response<AppResponse>;
			sendAPIStatus(statusCode: number): Response<AppResponse>;
			sendBadRequest(message: string): Response<AppResponse>;
		}
	}
}
