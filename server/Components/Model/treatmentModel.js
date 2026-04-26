const { getDB } = require('../Middleware/dbConnect');

async function initTreatmentsTable() {
  const db = getDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS treatments (
      treatment_id    INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      visit_id        INT(11) NOT NULL,
      treatment_given TEXT    NOT NULL,
      notes           TEXT    DEFAULT NULL,
      CONSTRAINT fk_treatment_visit FOREIGN KEY (visit_id) REFERENCES visits(visit_id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);
  console.log('treatments table ready');
}

async function createTreatment({ visit_id, treatment_given, notes }) {
  const db = getDB();
  const [result] = await db.execute(
    `INSERT INTO treatments (visit_id, treatment_given, notes) VALUES (?, ?, ?)`,
    [visit_id, treatment_given, notes ?? null]
  );
  return result.insertId;
}

async function findAllTreatments() {
  const db = getDB();
  const [rows] = await db.query(`SELECT * FROM treatments ORDER BY treatment_id`);
  return rows;
}

async function findTreatmentById(id) {
  const db = getDB();
  const [rows] = await db.execute(`SELECT * FROM treatments WHERE treatment_id = ?`, [id]);
  return rows[0] || null;
}

async function findTreatmentsByVisit(visit_id) {
  const db = getDB();
  const [rows] = await db.execute(`SELECT * FROM treatments WHERE visit_id = ?`, [visit_id]);
  return rows;
}

async function updateTreatment(id, fields) {
  const db = getDB();
  const allowed = ['visit_id', 'treatment_given', 'notes'];
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
    `UPDATE treatments SET ${setClauses.join(', ')} WHERE treatment_id = ?`,
    values
  );
  return result.affectedRows;
}

async function deleteTreatment(id) {
  const db = getDB();
  const [result] = await db.execute(`DELETE FROM treatments WHERE treatment_id = ?`, [id]);
  return result.affectedRows;
}

module.exports = {
  initTreatmentsTable,
  createTreatment,
  findAllTreatments,
  findTreatmentById,
  findTreatmentsByVisit,
  updateTreatment,
  deleteTreatment,
};
