import { Request, Response } from "express";
import { db } from "../db/config";
import { category } from "../db/schema";
import { getCategoryId } from "../db/service/help";
import { asc, count, desc, eq } from "drizzle-orm";

export async function createCategory(req: Request, res: Response) {
	const { categoryName } = req.body;

	try {
		const categoryId = await getCategoryId();
		await db.insert(category).values({
			categoryName: categoryName.trim(),
			categoryId,
		});

		res.json({
			categoryId,
		});
	} catch (e: any) {
		if (e.code === "ER_DUP_ENTRY") {
			return res.status(409).json({
				msg: "category name already exists",
				field: "categoryName",
			});
		}
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function updateCategory(req: Request, res: Response) {
	const { categoryId, categoryName } = req.body;

	try {
		const [updated] = await db
			.update(category)
			.set({
				categoryName: categoryName.trim(),
			})
			.where(eq(category.categoryId, categoryId));

		if (updated.affectedRows === 0) {
			return res.status(400).json({
				msg: "category is not found",
				field: "categoryId",
			});
		}

		res.json({
			msg: "success updated category",
		});
	} catch (e: any) {
		if (e.code === "ER_DUP_ENTRY") {
			return res.status(400).json({
				msg: "category name already exists",
				field: "categoryName",
			});
		}
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function deleteCategory(req: Request, res: Response) {
	const { categoryId } = req.params;

	try {
		const [deleted] = await db
			.delete(category)
			.where(eq(category.categoryId, categoryId as any));

		if (deleted.affectedRows === 0) {
			return res.status(400).json({
				msg: "category is not found",
				field: "categoryId",
			});
		}

		res.json({
			msg: "success deleted category",
		});
	} catch (e: any) {
		if (e.code === "ER_TRUNCATED_WRONG_VALUE") {
			return res.status(400).json({
				msg: "category is not found",
				field: "categoryId",
			});
		}
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getAllCateByDate(req: Request, res: Response) {
	const { offset, orderBy } = req.params;
	let query;

	try {
		query = db.select().from(category).offset(Number(offset)).limit(10);

		switch (orderBy) {
			case "asc":
				query = query.orderBy(asc(category.createdAt));
				break;
			case "desc":
				query = query.orderBy(desc(category.createdAt));
				break;
			default:
				break;
		}

		const categories = await query;
		res.json({
			categories,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getAllCateByName(req: Request, res: Response) {
	const { offset, orderBy } = req.params;
	let query;

	try {
		query = db.select().from(category).offset(Number(offset)).limit(10);

		switch (orderBy) {
			case "asc":
				query = query.orderBy(asc(category.categoryName));
				break;
			case "desc":
				query = query.orderBy(desc(category.categoryName));
				break;
			default:
				break;
		}

		const categories = await query;
		res.json({
			categories,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function countAllCategories(req: Request, res: Response) {
	try {
		const [total] = await db
			.select({
				total: count(),
			})
			.from(category);

		res.json({
			total: total.total,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}
