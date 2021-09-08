import { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";

//TODO use "message: instead of errors[]"
//TODO make a common validator, instead of repeating same logic across functions

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
	} catch (error) {
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
	} catch (error) {
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
			.isLength({ max: 40 })
			.withMessage("project name must be max 40 characters long")
			.run(req);
		await body("description")
			.isLength({ max: 500 })
			.withMessage("description must be max 500 characters long")
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
	} catch (error) {
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
	} catch (error) {
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
	} catch (error) {
		return res.sendStatus(400);
	}
	return next();
};

export const validateColumnIdPresent = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await body("columnId")
			.notEmpty()
			.withMessage("columnId must be present")
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

export const validateTicketIndices = async (
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
			.isFloat({ min: 0, max: 20 })
			.withMessage("firstIndex must be between 0 and 20")
			.run(req);
		await body("secondIndex")
			.notEmpty()
			.withMessage("secondIndex must be present")
			.isNumeric()
			.withMessage("secondIndex must be numeric")
			.isFloat({ min: 0, max: 20 })
			.withMessage("secondIndex must be between 0 and 20")
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

export const validateTicketTitlePresent = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await body("title")
			.notEmpty()
			.withMessage("ticket title must be present")
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

export const validateTicketTitleAndDescription = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await body("title")
			.isLength({ max: 80 })
			.withMessage("ticket title must be max 80 characters long")
			.run(req);
		await body("description")
			.isLength({ max: 400 })
			.withMessage("description must be max 400 characters long")
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
