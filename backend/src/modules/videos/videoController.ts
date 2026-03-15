import { Request, Response, NextFunction } from 'express';
import pool from '../../config/db';

export const getVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { videoId } = req.params;

        const [videos]: any = await pool.query('SELECT * FROM videos WHERE id = ?', [videoId]);
        if (videos.length === 0) {
            res.status(404).json({ error: 'Video not found' });
            return;
        }

        res.status(200).json(videos[0]);
    } catch (error) {
        next(error);
    }
};
