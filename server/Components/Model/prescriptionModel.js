const { getDB } = require('../Middleware/dbConnect');

async function initPrescriptionsTable() {
  const db = getDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      prescription_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      visit_id        INT(11) NOT NULL,
      medicine_id     INT(11) NOT NULL,
      quantity        INT(11) NOT NULL,
      CONSTRAINT fk_prescription_visit    FOREIGN KEY (visit_id)    REFERENCES visits(visit_id)       ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_prescription_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id)  ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);
  console.log('prescriptions table ready');
}

async function createPrescription({ visit_id, medicine_id, quantity }) {
  const db = getDB();
  const [result] = await db.execute(
    `INSERT INTO prescriptions (visit_id, medicine_id, quantity) VALUES (?, ?, ?)`,
    [visit_id, medicine_id, quantity]
  );
  return result.insertId;
}

async function findAllPrescriptions() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT p.*, m.name AS medicine_name
    FROM prescriptions p
    LEFT JOIN medicines m ON p.medicine_id = m.medicine_id
    ORDER BY p.prescription_id
  `);
  return rows;
}

async function findPrescriptionById(id) {
  const db = getDB();
  const [rows] = await db.execute(`
    SELECT p.*, m.name AS medicine_name
    FROM prescriptions p
    LEFT JOIN medicines m ON p.medicine_id = m.medicine_id
    WHERE p.prescription_id = ?
  `, [id]);
  return rows[0] || null;
}

async function findPrescriptionsByVisit(visit_id) {
  const db = getDB();
  const [rows] = await db.execute(`
    SELECT p.*, m.name AS medicine_name
    FROM prescriptions p
    LEFT JOIN medicines m ON p.medicine_id = m.medicine_id
    WHERE p.visit_id = ?
  `, [visit_id]);
  return rows;
}

async function updatePrescription(id, fields) {
  const db = getDB();
  const allowed = ['visit_id', 'medicine_id', 'quantity'];
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
    `UPDATE prescriptions SET ${setClauses.join(', ')} WHERE prescription_id = ?`,
    values
  );
  return result.affectedRows;
}

async function deletePrescription(id) {
  const db = getDB();
  const [result] = await db.execute(`DELETE FROM prescriptions WHERE prescription_id = ?`, [id]);
  return result.affectedRows;
}

module.exports = {
  initPrescriptionsTable,
  createPrescription,
  findAllPrescriptions,
  findPrescriptionById,
  findPrescriptionsByVisit,
  updatePrescription,
  deletePrescription,
};
