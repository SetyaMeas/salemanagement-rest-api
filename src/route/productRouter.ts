import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { zodValidate } from "../middleware/zodValidate";
import { z } from "zod";
import { zId, zOffset, zOrderBy, zProduct } from "../zod/zodSchema";
import {
	countAllProducts,
	countProductsByCate,
	countProductsWithNoCate,
	createProduct,
	deleteProduct,
	getProductsByCateIdAndSortByDate,
	getProductsByCateIdAndSortByName,
	getProductsByDate,
	getProductsByName,
	getProductsWithNoCateAndSortByDate,
	getProductsWithNoCateAndSortByName,
	updateProduct,
} from "../controller/productController";

const productRouter = express.Router();

// create (done)
productRouter.post(
	"/",
	verifyToken,
	zodValidate(
		z.object({
			body: z.object({
				productName: zProduct.productName,
				categoryId: zProduct.categoryId,
				price: zProduct.price,
				image: zProduct.image,
			}),
		})
	),
	createProduct
);

// delete (done)
productRouter.delete(
	"/:productId",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				productId: zId.asString,
			}),
		})
	),
	deleteProduct
);

// update (done)
productRouter.put(
	"/",
	verifyToken,
	zodValidate(
		z.object({
			body: z.object({
				productId: zId.asNumber,
				productName: zProduct.productName,
				categoryId: zProduct.categoryId,
				price: zProduct.price,
				image: zProduct.image,
			}),
		})
	),
	updateProduct
);

// sort by createdAt (done)
productRouter.get(
	"/all/sortByDate/:offset/:orderBy",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				offset: zOffset,
				orderBy: zOrderBy,
			}),
		})
	),
	getProductsByDate
);

// sort by name (done)
productRouter.get(
	"/all/sortByName/:offset/:orderBy",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				offset: zOffset,
				orderBy: zOrderBy,
			}),
		})
	),
	getProductsByName
);

// show product by category (sort by date) (done)
productRouter.get(
	"/all/cate/sortByDate/:categoryId/:offset/:orderBy",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				categoryId: zId.asString,
				offset: zOffset,
				orderBy: zOrderBy,
			}),
		})
	),
	getProductsByCateIdAndSortByDate
);

// show product by category (sort by name) (done)
productRouter.get(
	"/all/cate/sortByName/:categoryId/:offset/:orderBy",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				categoryId: zId.asString,
				offset: zOffset,
				orderBy: zOrderBy,
			}),
		})
	),
	getProductsByCateIdAndSortByName
);

// show product with no category (sort by date) (done)
productRouter.get(
	"/all/no-cate/sortByDate/:offset/:orderBy",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				offset: zOffset,
				orderBy: zOrderBy,
			}),
		})
	),
	getProductsWithNoCateAndSortByDate
);

// show product with no category (sort by name) (done)
productRouter.get(
	"/all/no-cate/sortByName/:offset/:orderBy",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				offset: zOffset,
				orderBy: zOrderBy,
			}),
		})
	),
	getProductsWithNoCateAndSortByName
);

// count product (done)
productRouter.get("/count-all", verifyToken, countAllProducts);

// count product by category (done)
productRouter.get("/count-cate/:categoryId", verifyToken, countProductsByCate);

// count product with no category (done)
productRouter.get("/count-no-cate", verifyToken, countProductsWithNoCate);

export default productRouter;
