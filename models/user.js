import pool from "../config/db.js";
import bcrypt from "bcrypt";

class User {
    static async findUserNameById (id) {
        const result = await pool.query("SELECT full_name FROM users WHERE id = $1", [id]);
        return result.rows[0].full_name;
    }
    static async findByEmail(email) {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async createUser(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users ( email, password) VALUES ($1, $2) RETURNING *",
            [ email, hashedPassword]
        );
        return result.rows[0];
    }
}

export default User;
