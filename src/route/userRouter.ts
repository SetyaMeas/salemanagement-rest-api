import express from "express";
import { zodValidate } from "../middleware/zodValidate";
import { z } from "zod";
import { zUser } from "../zod/zodSchema";
import { login, updateUser } from "../controller/userController";
import { verifyToken } from "../middleware/verifyToken";

const userRouter = express.Router();

// login (done)
userRouter.post(
	"/login",
	zodValidate(
		z.object({
			body: z.object({
				username: zUser.username,
				password: zUser.password,
			}),
		})
	),
	login
);

// update (done)
userRouter.put(
	"/update",
	verifyToken,
	zodValidate(
		z.object({
			body: z.object({
				oldPassword: zUser.password,
				newPassword: zUser.password,
				newUsername: zUser.username,
			}),
		})
	),
	updateUser
);

export default userRouter;
