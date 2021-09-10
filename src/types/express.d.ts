import { Response } from "express";
import { APIResponse } from "../models/APIResponse";
import { IUser } from "../models/User";

declare global {
	namespace Express {
		export interface Request {
			user: IUser;
			userId: string;
			projectId: string;
		}
		export interface Response {
			sendSuccess(message: string): Response<APIResponse>;
			sendSuccessWithData(data: object): Response<APIResponse>;
			sendFailure(error: any): Response<APIResponse>;
			sendValidationErrors(errors: object): Response<APIResponse>;
		}
	}
}
