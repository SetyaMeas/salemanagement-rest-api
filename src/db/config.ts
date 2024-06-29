import { config } from "dotenv";
import { createConnection } from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";

config();

export const connection = createConnection({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
});

export const db = drizzle(connection);
