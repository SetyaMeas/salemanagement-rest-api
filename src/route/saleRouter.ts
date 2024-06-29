import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { zodValidate } from "../middleware/zodValidate";
import { z } from "zod";
import { zId, zOffset, zOrderBy, zQty } from "../zod/zodSchema";
import {
	countAllSales,
	createSale,
	deleteSale,
	getSaleDetail,
	getSalesByDate,
	getSalesByTotalPrice,
} from "../controller/saleController";

const saleRouter = express.Router();

// create order (done)
saleRouter.post(
	"/create",
	verifyToken,
	zodValidate(
		z.object({
			body: z.object({
				orders: z.array(
					z.object({
						productId: zId.asNumber,
						qty: zQty,
					}),
					{ message: "invalid orders provided" }
				),
			}),
		})
	),
	createSale
);

// sort by date (done)
saleRouter.get(
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
	getSalesByDate
);

// sort by total price (done)
saleRouter.get(
	"/all/sortByPrice/:offset/:orderBy",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				offset: zOffset,
				orderBy: zOrderBy,
			}),
		})
	),
	getSalesByTotalPrice
);

// get detail (done)
saleRouter.get(
	"/detail/:saleId",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				saleId: zId.asString,
			}),
		})
	),
	getSaleDetail
);

// delete order (done)
saleRouter.delete(
	"/:saleId",
	verifyToken,
	zodValidate(
		z.object({
			params: z.object({
				saleId: zId.asString,
			}),
		})
	),
	deleteSale
);

// count sale (done)
saleRouter.get("/count-all", verifyToken, countAllSales);

export default saleRouter;
