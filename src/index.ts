import express, { NextFunction, Response } from "express";
import userRouter from "./route/userRouter";
import categoryRouter from "./route/categoryRouter";
import productRouter from "./route/productRouter";
import saleRouter from "./route/saleRouter";

export const app = express();
const port = 8080;

app.use(express.json());
app.use((_err: any, _req: any, res: Response, next: NextFunction) => {
	res.status(502).json({
		msg: "somthing went wrong",
	});
});

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/sale", saleRouter);

app.all("/*", (_: any, res: Response) => {
	res.status(404).json({
		msg: "Page not found",
	});
});

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
}
