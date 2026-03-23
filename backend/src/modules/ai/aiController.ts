import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

// Ensure you define an interface matching your AuthRequest if it differs from the default Express Request.
// Assuming AuthRequest extends standard Request with at least `user` property.
import { AuthRequest } from '../../middleware/authMiddleware';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const ROUTER_URL = 'https://router.huggingface.co/v1/chat/completions';

export const chatWithAgent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { message, history } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        if (!HUGGINGFACE_API_KEY) {
            console.warn('HUGGINGFACE_API_KEY is not set in environment variables');
            res.status(500).json({ error: 'AI agent is not properly configured on the server.' });
            return;
        }

        // Build standard chat message array
        const chatMessages = [
            { role: 'system', content: 'You are a helpful AI assistant for a learning path platform. Answer the user comprehensively and politely.' }
        ];

        if (history && Array.isArray(history)) {
            history.forEach((msg: { role: string, content: string }) => {
                const roleId = msg.role === 'assistant' ? 'assistant' : 'user';
                chatMessages.push({ role: roleId, content: msg.content });
            });
        }

        // Add the current user message
        chatMessages.push({ role: 'user', content: message });

        // Add timeout mechanism for external call using axios
        const response = await axios.post(
            ROUTER_URL,
            {
                model: 'meta-llama/Meta-Llama-3-8B-Instruct',
                messages: chatMessages,
                max_tokens: 512,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000 // 30 second timeout as HF inference can sometimes take a while to wake up
            }
        );

        // Process Hugging Face OpenAI-compatible response
        const generatedText = response.data?.choices?.[0]?.message?.content || '';

        res.status(200).json({ reply: generatedText.trim() });
    } catch (error: any) {
        if (error.code === 'ECONNABORTED') {
            res.status(504).json({ error: 'The AI service timed out. Please try again later.' });
            return;
        }
        
        console.error('Hugging Face AI Error:', error.response?.data || error.message);
        
        if (error.response?.status === 403) {
            res.status(403).json({ error: 'Your Hugging Face API key lacks permissions. Please go to huggingface.co/settings/tokens, edit your Fine-grained token, and ensure "Make calls to the Inference API / providers" is checked.' });
            return;
        }

        if (error.response?.status === 410) {
            res.status(410).json({ error: 'The AI model endpoint is deprecated. Please ensure the backend uses router.huggingface.co.' });
            return;
        }

        if (error.response?.status === 503 || error.response?.status === 504) {
            res.status(503).json({ error: 'The AI model is currently loading or unavailable. Please try again in 30 seconds.' });
            return;
        }

        next(error);
    }
};
