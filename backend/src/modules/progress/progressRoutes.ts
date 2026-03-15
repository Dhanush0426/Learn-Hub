import { Router } from 'express';
import { updateVideoProgress, getProgress } from './progressController';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getProgress);
router.post('/videos/:videoId', authenticate, updateVideoProgress);

export default router;
