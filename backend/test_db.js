const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment from root and backend
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

async function testConnection() {
    try {
        console.log('DATABASE_URL:', !!process.env.DATABASE_URL);
        const pool = process.env.DATABASE_URL 
            ? mysql.createPool({ 
                uri: process.env.DATABASE_URL, 
                ssl: { rejectUnauthorized: false },
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            })
            : mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            });
            
        console.log('Testing connection...');
        const [rows] = await pool.query('SHOW TABLES;');
        console.log('Connected! Tables:', rows);
        
        // Let's also verify users table exists
        const [users] = await pool.query('SELECT * FROM users LIMIT 1;');
        console.log('Users query:', users.length);

        await pool.end();
    } catch (err) {
        console.error('Connection failed! Code:', err.code, 'Message:', err.message);
    }
}
testConnection();
