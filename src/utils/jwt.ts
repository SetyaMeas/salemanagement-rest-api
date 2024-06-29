import { sign } from "jsonwebtoken";
import "dotenv/config";

export const generateToken = (data: any) => {
	const token = sign(data, process.env.SECRET_TOKEN as string, {
		expiresIn: "24h",
	});
	return token;
};
