const mysql = require('mysql2/promise');
const {DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT} = require("../config/config");

let pool = null;

async function connectDB() {
  if (pool) {
    console.log('DB already connected');
    return pool;
  }

  try {
    pool = mysql.createPool({
      host: DB_HOST || 'localhost',
      user: DB_USER || 'root',
      password: DB_PASS || '',
      database: DB_NAME,
      port: DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
    });

    // test connection
    const conn = await pool.getConnection();
    console.log('Connected to XAMPP + MariaDB Successfully');
    conn.release();

    return pool;
  } catch (err) {
    console.error('DB connection failed:', err.message);
    throw err;
  }
}

function getDB() {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return pool;
}

async function disconnectDB() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('DB disconnected');
  }
}

module.exports = {
  connectDB,
  getDB,
  disconnectDB
};