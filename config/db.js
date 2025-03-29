import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ProjectRepo",
    password: "root",
    port: 5432,
})
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Database connection error", err));
export default pool;
