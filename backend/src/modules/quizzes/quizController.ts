import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../config/db';
import { AuthRequest } from '../../middleware/authMiddleware';

export const getQuizzesBySubject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { subjectId } = req.params;
        const [quizzes]: any = await pool.query('SELECT * FROM quizzes WHERE subject_id = ?', [subjectId]);

        for (const quiz of quizzes) {
            const [questions]: any = await pool.query(
                'SELECT * FROM quiz_questions WHERE quiz_id = ?',
                [quiz.id]
            );
            quiz.questions = questions;
        }

        res.status(200).json(quizzes);
    } catch (error) {
        next(error);
    }
};

export const getAllQuizzes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;
        // Get quizzes for enrolled subjects
        const [quizzes]: any = await pool.query(`
            SELECT q.*, s.title as subject_title
            FROM quizzes q
            JOIN subjects s ON q.subject_id = s.id
            JOIN enrollments e ON e.subject_id = s.id AND e.user_id = ?
        `, [userId]);

        for (const quiz of quizzes) {
            const [questions]: any = await pool.query(
                'SELECT * FROM quiz_questions WHERE quiz_id = ?',
                [quiz.id]
            );
            quiz.questions = questions;
        }

        res.status(200).json(quizzes);
    } catch (error) {
        next(error);
    }
};

export const submitQuizAttempt = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body; // { questionId: selectedIndex }
        const userId = req.user?.userId;

        const [questions]: any = await pool.query(
            'SELECT * FROM quiz_questions WHERE quiz_id = ?',
            [quizId]
        );

        let score = 0;
        for (const q of questions) {
            if (answers[q.id] === q.correct_index) score++;
        }

        await pool.query(
            'INSERT INTO quiz_attempts (id, user_id, quiz_id, score, total) VALUES (?, ?, ?, ?, ?)',
            [uuidv4(), userId, quizId, score, questions.length]
        );

        res.status(200).json({ score, total: questions.length });
    } catch (error) {
        next(error);
    }
};
