import { Router } from 'express';
import { getAssignments, submitAssignment } from './assignmentController';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getAssignments);
router.post('/:assignmentId/submit', authenticate, submitAssignment);

export default router;
