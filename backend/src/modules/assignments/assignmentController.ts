import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const getAssignments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;
        // Get assignments for courses user is enrolled in
        const [assignments]: any = await pool.query(`
            SELECT a.*, s.title as subject_title,
                   sub.id as submission_id, sub.content as submission_content, sub.submitted_at
            FROM assignments a
            JOIN subjects s ON a.subject_id = s.id
            JOIN enrollments e ON e.subject_id = s.id AND e.user_id = ?
            LEFT JOIN submissions sub ON sub.assignment_id = a.id AND sub.user_id = ?
            ORDER BY a.due_date ASC
        `, [userId, userId]);
        res.status(200).json(assignments);
    } catch (error) {
        next(error);
    }
};

export const submitAssignment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { assignmentId } = req.params;
        const { content } = req.body;
        const userId = req.user?.userId;

        if (!content || !userId) {
            res.status(400).json({ error: 'Content is required' });
            return;
        }

        await pool.query(
            `INSERT INTO submissions (id, user_id, assignment_id, content)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE content = ?, submitted_at = NOW()`,
            [uuidv4(), userId, assignmentId, content, content]
        );

        res.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
};
