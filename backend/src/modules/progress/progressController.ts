import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const updateVideoProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { videoId } = req.params;
        const { timestamp = 0, completed } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const completedAt = completed ? new Date() : null;

        await pool.query(
            `INSERT INTO video_progress (id, user_id, video_id, last_position_seconds, is_completed, completed_at) 
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             last_position_seconds = GREATEST(last_position_seconds, ?),
             is_completed = IF(is_completed = 1, 1, ?),
             completed_at = IF(is_completed = 1, completed_at, ?)`,
            [uuidv4(), userId, videoId, timestamp || 0, completed ? 1 : 0, completedAt, timestamp || 0, completed ? 1 : 0, completedAt]
        );

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

export const getProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const [progress]: any = await pool.query(
            'SELECT video_id, last_position_seconds as timestamp, is_completed as completed FROM video_progress WHERE user_id = ?',
            [userId]
        );

        // Convert array to Record<string, VideoProgress>
        const result: Record<string, any> = {};
        for (const p of progress) {
            result[p.video_id] = {
                videoId: p.video_id,
                timestamp: p.timestamp,
                completed: !!p.completed
            };
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
