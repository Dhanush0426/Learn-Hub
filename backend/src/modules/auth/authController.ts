import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required' });
            return;
        }

        const [existingUsers]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }

        const userId = uuidv4();
        const hashed = await hashPassword(password);

        await pool.query(
            'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
            [userId, name, email, hashed]
        );

        const accessToken = generateAccessToken({ userId });
        
        res.status(201).json({
            token: accessToken,
            user: { id: userId, name, email }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const user = users[0];
        const isMatch = await comparePassword(password, user.password_hash);

        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const accessToken = generateAccessToken({ userId: user.id });

        res.status(200).json({
            token: accessToken,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(501).json({ message: 'Not implemented' });
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(200).json({ message: 'Logged out successfully' });
};
