import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config();

export default defineConfig({
	dialect: "mysql",
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		user: process.env.USER as string,
		password: process.env.PASSWORD as string,
		database: process.env.DB as string,
		host: process.env.HOST as string,
	},
});
