import mysql from 'mysql2/promise';
import { config } from './env';

const pool = config.DATABASE_URL 
    ? mysql.createPool({
        uri: config.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })
    : mysql.createPool({
        host: config.DB_HOST,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        ssl: config.DB_SSL ? { rejectUnauthorized: true } : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

export default pool;
