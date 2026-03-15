import { Router } from 'express';
import { getVideo } from './videoController';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/:videoId', authenticate, getVideo);

export default router;
