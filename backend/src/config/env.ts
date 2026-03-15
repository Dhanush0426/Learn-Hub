import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 3001,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'learn_flow',
    DB_SSL: process.env.DB_SSL === 'true',
    JWT_SECRET: process.env.JWT_SECRET || 'supersecret_jwt_key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
};
