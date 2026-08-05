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
            ? { rejectUnauthorized: false}
            : false
});

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_PORT:", process.env.DB_PORT);

await db.connect();

console.log("Database Connected.")

export default db;