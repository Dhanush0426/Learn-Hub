import { Router } from 'express';
import { getMe, updateMe } from './userController';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

export default router;
