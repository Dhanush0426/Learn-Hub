import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/authRoutes';
import subjectRoutes from './modules/subjects/subjectRoutes';
import sectionRoutes from './modules/sections/sectionRoutes';
import videoRoutes from './modules/videos/videoRoutes';
import enrollmentRoutes from './modules/enrollments/enrollmentRoutes';
import progressRoutes from './modules/progress/progressRoutes';
import assignmentRoutes from './modules/assignments/assignmentRoutes';
import quizRoutes from './modules/quizzes/quizRoutes';
import userRoutes from './modules/users/userRoutes';
import aiRoutes from './modules/ai/aiRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
// app.use('/api/sections', sectionRoutes); // We only get sections via subjects/:id/tree
app.use('/api/videos', videoRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health/db', async (req, res) => {
    try {
        const pool = (await import('./config/db')).default;
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'OK', message: 'Database connected successfully' });
    } catch (error: any) {
        res.status(500).json({ status: 'ERROR', message: 'Database connection failed', error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use(errorHandler);

export default app;
