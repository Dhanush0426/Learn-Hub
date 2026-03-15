import { Response, NextFunction } from 'express';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const [users]: any = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [userId]
        );
        if (users.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = users[0];

        // Get stats
        const [enrollCount]: any = await pool.query(
            'SELECT COUNT(*) as count FROM enrollments WHERE user_id = ?',
            [userId]
        );
        const [completedCount]: any = await pool.query(
            'SELECT COUNT(*) as count FROM video_progress WHERE user_id = ? AND is_completed = 1',
            [userId]
        );

        res.status(200).json({
            ...user,
            enrolledCourses: enrollCount[0].count,
            completedLessons: completedCount[0].count,
        });
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }

        await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};
