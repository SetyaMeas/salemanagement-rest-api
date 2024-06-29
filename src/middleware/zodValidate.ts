import { AnyZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

export const zodValidate =
	(schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
				headers: req.headers,
			});
			return next();
		} catch (error: any) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					msg: error.errors[0].message,
					field: error.errors[0].path[1],
				});
			}

			return res.status(502).json({
				msg: error.toString(),
			});
		}
	};
