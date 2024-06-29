import { compareSync, hashSync } from "bcryptjs";
import { log } from "console";
import { Request, Response } from "express";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { generateToken } from "../utils/jwt";

type TUser = {
	username: string;
	password: string;
};

export function login(req: Request, res: Response) {
	const { username, password } = req.body;

	try {
		const file = readFileSync(join(__dirname, "..", "db", "user.json"), {
			encoding: "utf-8",
		});

		const data: TUser = JSON.parse(file);

		if (username !== data.username) {
			return res.status(401).json({
				msg: "Username or Password is invalid",
				field: "user",
			});
		}

		const isCorrectPassword = compareSync(password, data.password);

		if (isCorrectPassword) {
			const token = generateToken({ login: true });
			return res.json({
				msg: "Success login",
				token,
			});
		}

		res.status(401).json({
			msg: "Username or Password is invalid",
			field: "user",
		});
	} catch (e: any) {
		if (e.code === "ENOENT") {
			return res.status(400).json({
				msg: "Can not find username and password",
				field: "user",
			});
		}

		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export function updateUser(req: Request, res: Response) {
	const { oldPassword, newPassword, newUsername } = req.body;

	try {
		const file = readFileSync(join(__dirname, "..", "db", "user.json"), {
			encoding: "utf-8",
		});

		const data: TUser = JSON.parse(file);
		const isCorrectPassword = compareSync(oldPassword, data.password);

		if (!isCorrectPassword) {
			return res.status(401).json({
				msg: "Invalid password",
				field: "oldPassword",
			});
		}

		data.username = newUsername.trim();
		data.password = hashSync(newPassword.trim(), 9);

		writeFileSync(
			join(__dirname, "..", "db", "user.json"),
			JSON.stringify(data),
			{ encoding: "utf-8" }
		);

		res.json({
			msg: "Success updated user",
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}
