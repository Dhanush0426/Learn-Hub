import { Router } from 'express';
import { chatWithAgent } from './aiController';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

// Endpoint for interacting with the AI agent
router.post('/chat', authenticate, chatWithAgent);

export default router;
