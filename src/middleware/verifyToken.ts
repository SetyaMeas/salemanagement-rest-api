import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import "dotenv/config";

export function verifyToken(req: any, res: Response, next: NextFunction) {
	const { authorization } = req.headers;

	try {
		verify(authorization, process.env.SECRET_TOKEN as string);
		return next();
	} catch (error: any) {
		if (error instanceof TokenExpiredError) {
			return res.status(401).json({
				msg: "Jwt token expired",
				field: "jwt",
			});
		} else if (error instanceof JsonWebTokenError) {
			return res.status(401).json({
				msg: "Invalid jwt token",
				field: "jwt",
			});
		}
		return res.status(502).json({
			msg: error.toString(),
		});
	}
}
