import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { zodValidate } from "../middleware/zodValidate";
import { z } from "zod";
import { zCategory, zId, zOrderBy } from "../zod/zodSchema";
import {
	countAllCategories,
	createCategory,
	deleteCategory,
	getAllCateByDate,
	getAllCateByName,
	updateCategory,
} from "../controller/categoryController";

const categoryRouter = express.Router();

// create (done)
categoryRouter.post(
	"/",
	verifyToken,
	zodValidate(
		z.object({
			body: z.object({
				categoryName: zCategory.categoryName,
			}),
		})
	),
	createCategory
);

// update (done)
categoryRouter.put(
	"/",
	verifyToken,
	zodValidate(
		z.object({
			body: z.object({
				categoryId: zId.asNumber,
				categoryName: zCategory.categoryName,
			}),
		})
	),
	updateCategory
);

// delete (done)
categoryRouter.delete(
	"/:categoryId",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				categoryId: zId.asString,
			}),
		})
	),
	deleteCategory
);

// sort by createdAt (done)
categoryRouter.get(
	"/all/sortByDate/:offset/:orderBy",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				offset: zId.asString,
				orderBy: zOrderBy,
			}),
		})
	),
	getAllCateByDate
);

// sort by name (done)
categoryRouter.get(
	"/all/sortByName/:offset/:orderBy",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				offset: zId.asString,
				orderBy: zOrderBy,
			}),
		})
	),
	getAllCateByName
);

// count all categories (done)
categoryRouter.get("/count-all", verifyToken, countAllCategories);

export default categoryRouter;
