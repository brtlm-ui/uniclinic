const { getDB } = require('../Middleware/dbConnect');

async function initStudentsTable() {
  const db = getDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS students (
      student_id     INT(11)      NOT NULL AUTO_INCREMENT PRIMARY KEY,
      student_number VARCHAR(20)  NOT NULL UNIQUE,
      first_name     VARCHAR(50)  NOT NULL,
      last_name      VARCHAR(50)  NOT NULL,
      course         VARCHAR(50)  DEFAULT NULL,
      year_level     INT(11)      DEFAULT NULL,
      contact_number VARCHAR(20)  DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);
  console.log('students table ready');
}

async function createStudent({ student_number, first_name, last_name, course, year_level, contact_number }) {
  const db = getDB();
  const [result] = await db.execute(
    `INSERT INTO students (student_number, first_name, last_name, course, year_level, contact_number)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [student_number, first_name, last_name, course ?? null, year_level ?? null, contact_number ?? null]
  );
  return result.insertId;
}

async function findAllStudents() {
  const db = getDB();
  const [rows] = await db.query(`SELECT * FROM students ORDER BY last_name, first_name`);
  return rows;
}

async function findStudentById(id) {
  const db = getDB();
  const [rows] = await db.execute(`SELECT * FROM students WHERE student_id = ?`, [id]);
  return rows[0] || null;
}

async function findStudentByNumber(student_number) {
  const db = getDB();
  const [rows] = await db.execute(`SELECT * FROM students WHERE student_number = ?`, [student_number]);
  return rows[0] || null;
}

async function updateStudent(id, fields) {
  const db = getDB();
  const allowed = ['student_number', 'first_name', 'last_name', 'course', 'year_level', 'contact_number'];
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
    `UPDATE students SET ${setClauses.join(', ')} WHERE student_id = ?`,
    values
  );
  return result.affectedRows;
}

async function deleteStudent(id) {
  const db = getDB();
  const [result] = await db.execute(`DELETE FROM students WHERE student_id = ?`, [id]);
  return result.affectedRows;
}

module.exports = {
  initStudentsTable,
  createStudent,
  findAllStudents,
  findStudentById,
  findStudentByNumber,
  updateStudent,
  deleteStudent,
};
