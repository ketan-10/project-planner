import { Request, Response, NextFunction, RequestHandler } from "express";
import {
	body,
	check,
	param,
	Result,
	validationResult,
} from "express-validator";
import { BaseError } from "../errors/base.error";
import { AssembeledProject } from "../models/Project";
import log from "../util/logger";

//TODO use "message: instead of errors[]"
//TODO make a common validator, instead of repeating same logic across functions

export const validatePresentInBody = (...args: string[]): RequestHandler => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const validations: Promise<Result<any>>[] = args.map((arg) => {
				return body(arg)
					.notEmpty()
					.withMessage(`${arg} must be present`)
					.run(req);
			});
			await Promise.all(validations);
			const validatonErrors = validationResult(req);
			if (validatonErrors && !validatonErrors.isEmpty()) {
				return res.status(400).json({
					success: false,
					errors: validatonErrors["errors"],
				});
			}
		} catch (error) {
			return res.sendStatus(400);
		}
		return next();
	};
};

export const validateCharacterLength = (
	parameter: string,
	max: number
): RequestHandler => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await check(parameter)
				.isLength({ max })
				.withMessage(
					`${parameter} should not be greater than ${max} characters`
				)
				.run(req);
			const validatonErrors = validationResult(req);
			if (validatonErrors && !validatonErrors.isEmpty()) {
				return res.status(400).json({
					success: false,
					errors: validatonErrors["errors"],
				});
			}
		} catch (error) {
			return res.sendStatus(400);
		}
		return next();
	};
};

export const validateNumericRange = (
	parameter: string,
	min: number,
	max: number
): RequestHandler => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await check(parameter)
				.isNumeric()
				.withMessage(`${parameter} must be numeric`)
				.isFloat({ min, max })
				.withMessage(`${parameter} must be between ${min} and ${max} `)
				.run(req);
			const validatonErrors = validationResult(req);
			if (validatonErrors && !validatonErrors.isEmpty()) {
				return res.status(400).json({
					success: false,
					errors: validatonErrors["errors"],
				});
			}
		} catch (error) {
			return res.sendStatus(400);
		}
		return next();
	};
};

export const validatePathParamPresent = (parameter: string): RequestHandler => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await param(parameter)
				.notEmpty()
				.withMessage(`${parameter} must be present in path`)
				.run(req);
			const validatonErrors = validationResult(req);
			if (validatonErrors && !validatonErrors.isEmpty()) {
				return res.status(400).json({
					success: false,
					errors: validatonErrors["errors"],
				});
			}
		} catch (error) {
			return res.sendStatus(400);
		}
		return next();
	};
};

export const validateProjectState = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const state: Partial<AssembeledProject> = req.body.state;
		log.info(JSON.stringify(req.session));
		if (
			state.project &&
			state?.project.columnIds &&
			state.project.columnIds.length > 0
		) {
			/**
			 * user must send columnIds of all columns.
			 */
			if (
				state.project.columnIds.length !== req.session.columnIds?.length
			) {
				throw new BaseError({
					statusCode: 400,
					description: `columnIds[] length did not match`,
				});
			}
			state.project.columnIds.forEach((columnId) => {
				if (!req.session.columnIds?.includes(columnId)) {
					throw new BaseError({
						statusCode: 404,
						description: `columnId ${columnId} not found`,
					});
				}
			});
		}
		if (state.columns && state.columns.length > 0) {
			/**
			 * if user sends columns ([] of ticketIds)
			 * validate _id of that column is present and all ticketIds [] are present
			 */
			state.columns.forEach((column) => {
				if (!req.session.columnIds?.includes(column._id)) {
					throw new BaseError({
						statusCode: 404,
						description: `columnId ${column._id} not found`,
					});
				}
				if (!column.ticketIds) {
					throw new BaseError({
						statusCode: 400,
						description: `ticketIds should be present for coulumnid ${column._id}`,
					});
				}
				column.ticketIds.forEach((ticketId) => {
					if (!req.session.ticketIds?.includes(ticketId)) {
						throw new BaseError({
							statusCode: 400,
							description: `ticketId ${ticketId} not found`,
						});
					}
				});
			});
		}
		return next();
	} catch (error) {
		if (error instanceof BaseError) return res.sendError(error);
		return res.sendAPIStatus(400);
	}
};
