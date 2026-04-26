const { getDB } = require('../Middleware/dbConnect');

/**
 * Creates the `staff` table if it does not already exist.
 * Matches the uniclinic_tracker schema exactly.
 */
async function initStaffTable() {
  const db = getDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS staff (
      staff_id  INT(11)      NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name      VARCHAR(100) NOT NULL,
      role      ENUM('admin','nurse','doctor') NOT NULL,
      username  VARCHAR(50)  NOT NULL UNIQUE,
      password  VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);
  console.log('staff table ready');
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateStaff(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2)
    errors.push('Name must be at least 2 characters');
  if (!data.role || !['admin', 'nurse', 'doctor'].includes(data.role))
    errors.push('Role must be admin, nurse, or doctor');
  if (!data.username || data.username.trim().length < 3)
    errors.push('Username must be at least 3 characters');
  if (!data.password || data.password.length < 6)
    errors.push('Password must be at least 6 characters');
  return errors;
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

async function createStaff({ name, role, username, password }) {
  const db = getDB();
  const [result] = await db.execute(
    `INSERT INTO staff (name, role, username, password) VALUES (?, ?, ?, ?)`,
    [name, role, username, password]
  );
  return result.insertId;
}

async function findAllStaff() {
  const db = getDB();
  const [rows] = await db.query(
    `SELECT staff_id, name, role, username FROM staff`
  );
  return rows;
}

async function findStaffById(id) {
  const db = getDB();
  const [rows] = await db.execute(
    `SELECT staff_id, name, role, username FROM staff WHERE staff_id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findStaffByUsername(username) {
  const db = getDB();
  const [rows] = await db.execute(
    `SELECT * FROM staff WHERE username = ?`,
    [username]
  );
  return rows[0] || null;
}

async function updateStaff(id, fields) {
  const db = getDB();
  const allowed = ['name', 'role', 'username', 'password'];
  const setClauses = [];
  const values = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      setClauses.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (setClauses.length === 0) return 0;

  values.push(id);
  const [result] = await db.execute(
    `UPDATE staff SET ${setClauses.join(', ')} WHERE staff_id = ?`,
    values
  );
  return result.affectedRows;
}

async function deleteStaff(id) {
  const db = getDB();
  const [result] = await db.execute(
    `DELETE FROM staff WHERE staff_id = ?`,
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  initStaffTable,
  validateStaff,
  createStaff,
  findAllStaff,
  findStaffById,
  findStaffByUsername,
  updateStaff,
  deleteStaff,
};