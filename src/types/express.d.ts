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
		export interface Response<R = APIResponse> {
			sendSuccess(message: string): Response<R>;
			sendSuccessWithData(data: object): Response<R>;
			sendError(error: any): Response<R>;
			sendValidationErrors(errors: object): Response<R>;
			sendAPIStatus(statusCode: number): Response<R>;
			sendBadRequest(message: string): Response<R>;
		}
	}
}
