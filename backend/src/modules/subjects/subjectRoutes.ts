import { Router } from 'express';
import { getSubjects, getSubjectTree } from './subjectController';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getSubjects);
router.get('/:subjectId', authenticate, getSubjectTree); // For now tree is returning for subjectId
router.get('/:subjectId/tree', authenticate, getSubjectTree);

export default router;
