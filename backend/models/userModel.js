import { pool } from "../config/db.js";

export const createUser = async (email, hashedPassword) => {
    const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, hashedPassword]
    );
    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    return result.rows[0];
}

export const findUserById = async (id) => {
    const result = await pool.query('SELECT id, email FROM users WHERE id=$1', [id]);
    return result.rows[0];
}

