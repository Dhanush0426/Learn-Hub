import app from './app';
import { config } from './config/env';
import pool from './config/db';

const PORT = config.PORT;

const startServer = async () => {
    try {
        await pool.query('SELECT 1'); // Test DB connection
        console.log('Connected to MySQL DB');
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to database', error);
        process.exit(1);
    }
};

startServer();
