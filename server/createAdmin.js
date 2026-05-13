const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

const SALT_ROUNDS = 10;

async function createAdminUser() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'uniclinic_tracker'
  });

  try {
    // Set a default password (you can change this)
    const password = 'Karen@123';
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT * FROM staff WHERE username = ?',
      ['Karen']
    );

    if (existing.length > 0) {
      console.log('Admin user Karen already exists!');
      const [staff] = await connection.execute(
        'SELECT staff_id, name, username, role FROM staff WHERE username = ?',
        ['Karen']
      );
      console.log('Current admin:', staff[0]);
    } else {
      // Insert new admin
      const [result] = await connection.execute(
        'INSERT INTO staff (name, role, username, password, email) VALUES (?, ?, ?, ?, ?)',
        ['Karen', 'admin', 'Karen', hashedPassword, 'karen@uniclinic.com']
      );
      console.log('✓ Admin user created successfully!');
      console.log('Username: Karen');
      console.log('Password: ' + password);
      console.log('Role: admin');
    }
  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    await connection.end();
  }
}

createAdminUser();
