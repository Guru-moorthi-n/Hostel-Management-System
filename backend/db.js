import pg from "pg";
import "dotenv/config";

const db = new pg.Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),

    ssl:
        process.env.NODE_ENV === "production"
            ? {
                rejectUnauthorized: false,
            }
            : false,
});

await db.connect();

export default db;