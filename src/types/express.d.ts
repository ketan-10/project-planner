import { Response, Send } from "express";
import { APIResponse } from "./APIResponse";
import { IUser } from "../models/User";

declare global {
	namespace Express {
		export interface Request {
			user: IUser;
			userId: string;
			projectId: string;
		}
		export interface Response<_ = any> {
			sendSuccess(message: string): Response<APIResponse>;
			sendSuccessWithData(data: object): Response<APIResponse>;
			sendError(error: any): Response<APIResponse>;
			sendValidationErrors(errors: object): Response<APIResponse>;
			sendAPIStatus(statusCode: number): Response<APIResponse>;
			sendBadRequest(message: string): Response<APIResponse>;
		}
	}
}
