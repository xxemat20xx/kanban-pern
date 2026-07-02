import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookieOptions } from '../config/cookieOptions.js';
import { createUser, findUserByEmail } from '../models/userModel.js';

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = await createUser(email, hashed);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, cookieOptions).status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Email already exists or invalid input' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, cookieOptions).json({ id: user.id, email: user.email });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
};

export const getMe = (req, res) => {
    res.json(req.user);
};