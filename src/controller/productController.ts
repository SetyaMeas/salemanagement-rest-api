import { Request, Response } from "express";
import { db } from "../db/config";
import { category, product } from "../db/schema";
import { getProductId } from "../db/service/help";
import { asc, count, desc, eq, isNull } from "drizzle-orm";

const productSelection = {
	productId: product.productId,
	categoryId: category.categoryId,
	productName: product.productName,
	categoryName: category.categoryName,
	createdAt: product.createdAt,
	price: product.price,
	image: product.image,
};

export async function createProduct(req: Request, res: Response) {
	const { productName, price, categoryId, image } = req.body;

	try {
		const productId = await getProductId();

		await db.insert(product).values({
			productName: productName.trim(),
			productId,
			categoryId,
			price,
			image,
		});

		res.json({
			productId,
		});
	} catch (e: any) {
		if (e.code === "ER_DUP_ENTRY") {
			return res.status(409).json({
				msg: "product name already exists",
				field: "productName",
			});
		}

		if (e.code === "ER_NO_REFERENCED_ROW_2") {
			return res.status(400).json({
				msg: "category not found",
				field: "categoryId",
			});
		}

		if (e.code === "ER_WARN_DATA_OUT_OF_RANGE") {
			return res.status(400).json({
				msg: "price can not be more than 3 figures",
				field: "price",
			});
		}
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function deleteProduct(req: Request, res: Response) {
	const { productId } = req.params;

	try {
		const [deleted] = await db
			.delete(product)
			.where(eq(product.productId, productId as any));

		if (deleted.affectedRows === 0) {
			return res.status(400).json({
				msg: "product not found",
				field: "productId",
			});
		}

		res.json({
			msg: "success deleted product",
		});
	} catch (e: any) {
		if (e.code === "ER_TRUNCATED_WRONG_VALUE") {
			return res.status(400).json({
				msg: "product not found",
				field: "productId",
			});
		}
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getProductsByDate(req: Request, res: Response) {
	const { offset, orderBy } = req.params;
	let query;

	try {
		query = db
			.select(productSelection)
			.from(product)
			.leftJoin(category, eq(category.categoryId, product.categoryId))
			.offset(Number(offset))
			.limit(10);

		switch (orderBy) {
			case "asc":
				query = query.orderBy(asc(product.createdAt));
				break;
			case "desc":
				query = query.orderBy(desc(product.createdAt));
				break;
			default:
				break;
		}

		const products = await query;
		res.json({
			products,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getProductsByName(req: Request, res: Response) {
	const { offset, orderBy } = req.params;
	let query;

	try {
		query = db
			.select(productSelection)
			.from(product)
			.leftJoin(category, eq(category.categoryId, product.categoryId))
			.offset(Number(offset))
			.limit(10);

		switch (orderBy) {
			case "asc":
				query = query.orderBy(asc(product.productName));
				break;
			case "desc":
				query = query.orderBy(desc(product.productName));
				break;
			default:
				break;
		}

		const products = await query;
		res.json({
			products,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function updateProduct(req: Request, res: Response) {
	const { productId, productName, image, categoryId, price } = req.body;

	try {
		const [updated] = await db
			.update(product)
			.set({
				productName: productName.trim(),
				image,
				categoryId,
				price,
			})
			.where(eq(product.productId, productId));

		if (updated.affectedRows === 0) {
			return res.status(400).json({
				msg: "product not found",
				field: "productId",
			});
		}

		res.json({
			msg: "success updated product",
		});
	} catch (e: any) {
		if (e.code === "ER_DUP_ENTRY") {
			return res.status(409).json({
				msg: "product name already exists",
				field: "productName",
			});
		}

		if (e.code === "ER_NO_REFERENCED_ROW_2") {
			return res.status(400).json({
				msg: "category not found",
				field: "categoryId",
			});
		}

		if (e.code === "ER_WARN_DATA_OUT_OF_RANGE") {
			return res.status(400).json({
				msg: "price can not be more than 3 figures",
				field: "price",
			});
		}
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getProductsByCateIdAndSortByDate(
	req: Request,
	res: Response
) {
	const { offset, orderBy, categoryId }: any = req.params;
	let query;

	try {
		query = db
			.select(productSelection)
			.from(product)
			.innerJoin(category, eq(category.categoryId, product.categoryId))
			.where(eq(product.categoryId, categoryId))
			.offset(Number(offset))
			.limit(10);

		switch (orderBy) {
			case "asc":
				query = query.orderBy(asc(product.createdAt));
				break;
			case "desc":
				query = query.orderBy(desc(product.createdAt));
				break;
			default:
				break;
		}

		const products = await query;
		res.json({
			products,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getProductsByCateIdAndSortByName(
	req: Request,
	res: Response
) {
	const { offset, orderBy, categoryId }: any = req.params;
	let query;

	try {
		query = db
			.select(productSelection)
			.from(product)
			.innerJoin(category, eq(category.categoryId, product.categoryId))
			.where(eq(product.categoryId, categoryId))
			.offset(Number(offset))
			.limit(10);

		switch (orderBy) {
			case "asc":
				query = query.orderBy(asc(product.productName));
				break;
			case "desc":
				query = query.orderBy(desc(product.productName));
				break;
			default:
				break;
		}

		const products = await query;
		res.json({
			products,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getProductsWithNoCateAndSortByDate(
	req: Request,
	res: Response
) {
	const { offset, orderBy }: any = req.params;
	let query;

	try {
		query = db
			.select({
				productId: product.productId,
				categoryId: product.categoryId,
				productName: product.productName,
				createdAt: product.createdAt,
				price: product.price,
				image: product.image,
			})
			.from(product)
			.where(isNull(product.categoryId))
			.offset(Number(offset))
			.limit(10);

		switch (orderBy) {
			case "asc":
				query = query.orderBy(asc(product.createdAt));
				break;
			case "desc":
				query = query.orderBy(desc(product.createdAt));
				break;
			default:
				break;
		}

		const products = await query;
		res.json({
			products,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getProductsWithNoCateAndSortByName(
	req: Request,
	res: Response
) {
	const { offset, orderBy }: any = req.params;
	let query;

	try {
		query = db
			.select({
				productId: product.productId,
				categoryId: product.categoryId,
				productName: product.productName,
				createdAt: product.createdAt,
				price: product.price,
				image: product.image,
			})
			.from(product)
			.where(isNull(product.categoryId))
			.offset(Number(offset))
			.limit(10);

		switch (orderBy) {
			case "asc":
				query = query.orderBy(asc(product.productName));
				break;
			case "desc":
				query = query.orderBy(desc(product.productName));
				break;
			default:
				break;
		}

		const products = await query;
		res.json({
			products,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function countAllProducts(req: Request, res: Response) {
	try {
		const [total] = await db
			.select({
				total: count(),
			})
			.from(product);

		res.json({
			total: total.total,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function countProductsByCate(req: Request, res: Response) {
	const { categoryId } = req.params;

	try {
		const [total] = await db
			.select({
				total: count(),
			})
			.from(product)
			.where(eq(product.categoryId, Number(categoryId)));

		res.json({
			total: total.total,
		});
	} catch (e: any) {
		if (e.code === "ER_BAD_FIELD_ERROR") {
			return res.status(400).json({
				msg: "invalid category id",
				field: "categoryId",
			});
		}
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function countProductsWithNoCate(req: Request, res: Response) {
	try {
		const [total] = await db
			.select({
				total: count(),
			})
			.from(product)
			.where(isNull(product.categoryId));

		res.json({
			total: total.total,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}
