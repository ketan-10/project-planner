import status from "http-status";

export interface IBaseError {
	description?: string;
	statusCode: number;
	isOperational?: boolean;
}

export class BaseError extends Error implements IBaseError {
	statusCode: number;
	description: string;
	isOperational: boolean;

	constructor(args: IBaseError) {
		const { statusCode, description, isOperational } = args;
		super(description);
		this.statusCode = statusCode;
		this.description = description ?? (status[statusCode] as string);
		this.isOperational =
			isOperational ??
			(status[`${statusCode}_CLASS`] as string) !== "5xx";
	}
}
