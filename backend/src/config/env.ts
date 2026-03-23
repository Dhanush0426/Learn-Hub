import dotenv from 'dotenv';
import path from 'path';

// Load variables from the root .env file (for DATABASE_URL and HUGGINGFACE_API_KEY)
dotenv.config({ path: path.join(__dirname, '../../../.env') });
// Also load the local backend/.env file
dotenv.config();

export const config = {
    PORT: process.env.PORT || 3001,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'learn_flow',
    DB_SSL: process.env.DB_SSL === 'true',
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'supersecret_jwt_key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
};
