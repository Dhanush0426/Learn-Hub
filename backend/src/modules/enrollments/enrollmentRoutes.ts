import { Router } from 'express';
import { enroll, getMyEnrollments } from './enrollmentController';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, enroll);
router.get('/my', authenticate, getMyEnrollments);

export default router;
