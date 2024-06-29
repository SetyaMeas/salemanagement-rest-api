import { sql } from "drizzle-orm";
import { db } from "../config";

export const getCategoryId = async (): Promise<number> => {
	const [[getId]]: any = await db.execute(
		sql`SELECT * FROM vCategory_PrimaryKey`
	);
	return getId.id;
};

export const getProductId = async (): Promise<number> => {
	const [[getId]]: any = await db.execute(
		sql`SELECT * FROM vProduct_PrimaryKey`
	);
	return getId.id;
};

export const getSaleId = async (): Promise<number> => {
	const [[getId]]: any = await db.execute(sql`SELECT * FROM vSale_PrimaryKey`);
	return getId.id;
};
