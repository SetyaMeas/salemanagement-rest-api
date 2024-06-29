import { sql } from "drizzle-orm";
import {
	bigint,
	datetime,
	decimal,
	int,
	longtext,
	mysqlTable,
	serial,
	varchar,
} from "drizzle-orm/mysql-core";

export const category = mysqlTable("tblCategory", {
	categoryId: int("categoryId").primaryKey(),
	categoryName: varchar("categoryName", { length: 255 }).notNull().unique(),
	createdAt: datetime("createdAt")
		.notNull()
		.$defaultFn(() => sql`now()`),
});

export const product = mysqlTable("tblProduct", {
	productId: int("productId").primaryKey(),
	productName: varchar("productName", { length: 255 }).notNull().unique(),
	categoryId: int("categoryId").references(() => category.categoryId),
	price: decimal("price", { precision: 5, scale: 2 }).notNull(),
	image: longtext("image"),
	createdAt: datetime("createdAt")
		.notNull()
		.$defaultFn(() => sql`now()`),
});

export const sale = mysqlTable("tblSale", {
	saleId: int("saleId").primaryKey(),
	saleDate: datetime("saleDate")
		.notNull()
		.$defaultFn(() => sql`now()`),
});

export const saleDetail = mysqlTable("tblSaleDetail", {
	sdId: serial("sdId").primaryKey(),
	saleId: int("saleId").references(() => sale.saleId),
	productId: int("productId").references(() => product.productId),
	qty: int("qty").notNull(),
	price: decimal("price", { precision: 5, scale: 2 }).notNull(),
});
