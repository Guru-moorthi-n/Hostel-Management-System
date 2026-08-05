import pg from "pg";
import "dotenv/config";

const db = new pg.Pool({
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

db.on("error", (err) => {
    console.error("Unexpected database error:", err);
});

console.log("Database Connected.")

export default db;