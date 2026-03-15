import { Request, Response, NextFunction } from 'express';
import pool from '../../config/db';

export const getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const [subjects]: any = await pool.query('SELECT * FROM subjects WHERE is_published = TRUE');
        const [sections]: any = await pool.query('SELECT * FROM sections ORDER BY order_index ASC');
        const [videos]: any = await pool.query(`
            SELECT v.* FROM videos v 
            JOIN sections s ON v.section_id = s.id 
            ORDER BY s.order_index ASC, v.order_index ASC
        `);

        const result = subjects.map((subject: any) => ({
            ...subject,
            sections: sections
                .filter((subSeq: any) => subSeq.subject_id === subject.id)
                .map((section: any) => ({
                    ...section,
                    videos: videos.filter((video: any) => video.section_id === section.id)
                }))
        }));

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getSubjectTree = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { subjectId } = req.params;

        const [subjects]: any = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
        if (subjects.length === 0) {
            res.status(404).json({ error: 'Subject not found' });
            return;
        }
        
        const subject = subjects[0];

        const [sections]: any = await pool.query('SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC', [subjectId]);
        
        const [videos]: any = await pool.query(`
            SELECT v.* FROM videos v 
            JOIN sections s ON v.section_id = s.id 
            WHERE s.subject_id = ? 
            ORDER BY s.order_index ASC, v.order_index ASC
        `, [subjectId]);

        // Build tree
        subject.sections = sections.map((section: any) => ({
            ...section,
            videos: videos.filter((video: any) => video.section_id === section.id)
        }));

        res.status(200).json(subject);
    } catch (error) {
        next(error);
    }
};
