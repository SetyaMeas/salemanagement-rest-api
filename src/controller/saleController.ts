import { Request, Response } from "express";
import { getSaleId } from "../db/service/help";
import { db } from "../db/config";
import { product, sale, saleDetail } from "../db/schema";
import { asc, count, desc, eq, sql, sum } from "drizzle-orm";

type TOrder = {
	productId: number;
	qty: number;
};

export async function createSale(req: Request, res: Response) {
	const orders: TOrder[] = req.body.orders;
	let saleId = -1;

	try {
		saleId = await getSaleId();
		await db.insert(sale).values({
			saleId,
		});

		for (let i = 0; i < orders.length; i++) {
			const [existedProduct] = await db
				.select()
				.from(product)
				.where(eq(product.productId, orders[i].productId))
				.limit(1);

			// if one of products not found
			// then we have to cancel the order
			if (!existedProduct) {
				await db.delete(sale).where(eq(sale.saleId, saleId));
				return res.status(400).json({
					msg: "product(s) may not exists",
					field: "orders",
				});
			}

			await db.insert(saleDetail).values({
				saleId,
				price: existedProduct.price,
				qty: orders[i].qty,
				productId: orders[i].productId,
			});
		}

		// calculate total price and total qty then display
		const order = await db
			.select({
				saleId: sale.saleId,
				saleDate: sale.saleDate,
				totalPrice: sql`SUM(${saleDetail.price} * ${saleDetail.qty})`, // i don't know how to multiply column in drizzle bultin-methods
				totalQty: sum(saleDetail.qty),
			})
			.from(sale)
			.innerJoin(saleDetail, eq(sale.saleId, saleDetail.saleId))
			.where(eq(sale.saleId, saleId));

		res.json({
			order,
		});
	} catch (e: any) {
		// we have to cancel order went something went wrong
		await db.delete(sale).where(eq(sale.saleId, saleId));
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getSalesByDate(req: Request, res: Response) {
	const { orderBy, offset } = req.params;
	let query;

	try {
		query = db
			.select({
				saleId: sale.saleId,
				saleDate: sale.saleDate,
				totalPrice: sql`SUM(${saleDetail.price} * ${saleDetail.qty})`, // i don't know how to multiply column in drizzle bultin-methods
				totalQty: sum(saleDetail.qty),
			})
			.from(sale)
			.innerJoin(saleDetail, eq(sale.saleId, saleDetail.saleId))
			.offset(Number(offset))
			.limit(10)
			.groupBy(sale.saleId);

		switch (orderBy) {
			case "asc":
				query = query.orderBy(asc(sale.saleDate));
				break;
			case "desc":
				query = query.orderBy(desc(sale.saleDate));
				break;
			default:
				break;
		}

		const orders = await query;
		res.json({
			orders,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getSalesByTotalPrice(req: Request, res: Response) {
	const { orderBy, offset } = req.params;
	let query;

	try {
		query = db
			.select({
				saleId: sale.saleId,
				saleDate: sale.saleDate,
				totalPrice: sql`SUM(${saleDetail.price} * ${saleDetail.qty})`, // i don't know how to multiply column in drizzle bultin-methods
				totalQty: sum(saleDetail.qty),
			})
			.from(sale)
			.innerJoin(saleDetail, eq(sale.saleId, saleDetail.saleId))
			.offset(Number(offset))
			.limit(10)
			.groupBy(sale.saleId);

		switch (orderBy) {
			case "asc":
				query = query.orderBy(
					asc(sql`SUM(${saleDetail.price} * ${saleDetail.qty})`)
				);
				break;
			case "desc":
				query = query.orderBy(
					desc(sql`SUM(${saleDetail.price} * ${saleDetail.qty})`)
				);
				break;
			default:
				break;
		}

		const orders = await query;
		res.json({
			orders,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function getSaleDetail(req: Request, res: Response) {
	const { saleId }: any = req.params;

	try {
		const orders = await db
			.select()
			.from(saleDetail)
			.where(eq(saleDetail.saleId, saleId));

		if (orders.length === 0) {
			return res.status(400).json({
				msg: "sale not found",
				field: "saleId",
			});
		}

		res.json({
			orders,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function deleteSale(req: Request, res: Response) {
	const { saleId }: any = req.params;

	try {
		const [deleted] = await db.delete(sale).where(eq(sale.saleId, saleId));

		if (deleted.affectedRows === 0) {
			return res.status(400).json({
				msg: "sale not found",
				field: "saleId",
			});
		}

		res.json({
			msg: "success deleted sale",
		});
	} catch (e: any) {
		if (e.code === "ER_TRUNCATED_WRONG_VALUE") {
			return res.status(400).json({
				msg: "sale not found",
				field: "saleId",
			});
		}
		res.status(502).json({
			msg: e.toString(),
		});
	}
}

export async function countAllSales(req: Request, res: Response) {
	try {
		const [total] = await db
			.select({
				total: count(),
			})
			.from(sale);

		res.json({
			total: total.total,
		});
	} catch (e: any) {
		res.status(502).json({
			msg: e.toString(),
		});
	}
}
