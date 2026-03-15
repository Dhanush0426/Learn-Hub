import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const enroll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { subjectId } = req.body;
        const userId = req.user?.userId;

        if (!subjectId || !userId) {
            res.status(400).json({ error: 'Subject ID is required' });
            return;
        }

        try {
            await pool.query(
                'INSERT INTO enrollments (id, user_id, subject_id) VALUES (?, ?, ?)',
                [uuidv4(), userId, subjectId]
            );
            res.status(201).json({ success: true });
        } catch (err: any) {
            // Check for duplicate entry error
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(200).json({ success: true, message: 'Already enrolled' });
                return;
            }
            throw err;
        }
    } catch (error) {
        next(error);
    }
};

export const getMyEnrollments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const [enrollments]: any = await pool.query(
            'SELECT * FROM enrollments WHERE user_id = ?',
            [userId]
        );

        res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }
};
