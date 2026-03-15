import { Router } from 'express';
import { getQuizzesBySubject, getAllQuizzes, submitQuizAttempt } from './quizController';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getAllQuizzes);
router.get('/subject/:subjectId', authenticate, getQuizzesBySubject);
router.post('/:quizId/attempt', authenticate, submitQuizAttempt);

export default router;
