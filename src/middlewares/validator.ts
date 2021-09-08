import { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";

export const validateUsernamePassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await body("username")
			.notEmpty()
			.withMessage("username must be present")
			.run(req);
		await body("password")
			.notEmpty()
			.withMessage("password must be present")
			.isLength({ min: 6 })
			.withMessage("password must be atleast 6 characters long")
			.run(req);

		const validatonErrors = validationResult(req);
		if (validatonErrors && !validatonErrors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: validatonErrors["errors"],
			});
		}
	} catch (err) {
		return res.sendStatus(400);
	}
	return next();
};

export const validateProjectNamePresent = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await body("projectName")
			.notEmpty()
			.withMessage("projectName must be present")
			.run(req);
		const validatonErrors = validationResult(req);
		if (validatonErrors && !validatonErrors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: validatonErrors["errors"],
			});
		}
	} catch (err) {
		return res.sendStatus(400);
	}
	return next();
};

export const validateProjectNameAndDescription = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await body("projectName")
			.isLength({ max: 20 })
			.withMessage("project name must be max 20 characters long")
			.run(req);
		await body("description")
			.isLength({ max: 200 })
			.withMessage("description must be max 200 characters long")
			.run(req);
		const validatonErrors = validationResult(req);
		if (validatonErrors && !validatonErrors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: validatonErrors["errors"],
			});
		}
	} catch (err) {
		return res.sendStatus(400);
	}
	return next();
};

export const validateProjectId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await check("projectId")
			.notEmpty()
			.withMessage("project id must be present")
			.run(req);

		const validatonErrors = validationResult(req);
		if (validatonErrors && !validatonErrors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: validatonErrors["errors"],
			});
		}
	} catch (err) {
		return res.sendStatus(400);
	}
	return next();
};

export const validateColumnName = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await body("columnName")
			.notEmpty()
			.withMessage("columnName must be present")
			.isLength({ max: 20 })
			.withMessage("column name must be max 20 characters long")
			.run(req);
		const validatonErrors = validationResult(req);
		if (validatonErrors && !validatonErrors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: validatonErrors["errors"],
			});
		}
	} catch (err) {
		return res.sendStatus(400);
	}
	return next();
};

export const validateColumnIndices = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await body("firstIndex")
			.notEmpty()
			.withMessage("firstIndex must be present")
			.isNumeric()
			.withMessage("firstIndex must be numeric")
			.isFloat({ min: 0, max: 6 })
			.withMessage("firstIndex must be between 0 and 6")
			.run(req);
		await body("secondIndex")
			.notEmpty()
			.withMessage("secondIndex must be present")
			.isNumeric()
			.withMessage("secondIndex must be numeric")
			.isFloat({ min: 0, max: 6 })
			.withMessage("secondIndex must be between 0 and 6")
			.run(req);
		const validatonErrors = validationResult(req);
		if (validatonErrors && !validatonErrors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: validatonErrors["errors"],
			});
		}
	} catch (err) {
		return res.sendStatus(400);
	}
	return next();
};
