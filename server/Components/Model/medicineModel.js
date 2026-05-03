const { getDB } = require('../Middleware/dbConnect');

async function initMedicinesTable() {
  const db = getDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS medicines (
      medicine_id     INT(11)      NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name            VARCHAR(100) NOT NULL,
      stock_quantity  INT(11)      DEFAULT 0,
      expiration_date DATE         DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);
  console.log('medicines table ready');
}

async function createMedicine({ name, stock_quantity, expiration_date }) {
  const db = getDB();
  const [result] = await db.execute(
    `INSERT INTO medicines (name, stock_quantity, expiration_date) VALUES (?, ?, ?)`,
    [name, stock_quantity ?? 0, expiration_date ?? null]
  );
  return result.insertId;
}

async function findAllMedicines() {
  const db = getDB();
  const [rows] = await db.query(`SELECT * FROM medicines ORDER BY name`);
  return rows;
}

async function findMedicineById(id) {
  const db = getDB();
  const [rows] = await db.execute(`SELECT * FROM medicines WHERE medicine_id = ?`, [id]);
  return rows[0] || null;
}

async function updateMedicine(id, fields) {
  const db = getDB();
  const allowed = ['name', 'stock_quantity', 'expiration_date'];
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
    `UPDATE medicines SET ${setClauses.join(', ')} WHERE medicine_id = ?`,
    values
  );
  return result.affectedRows;
}

async function deleteMedicine(id) {
  const db = getDB();
  const [result] = await db.execute(`DELETE FROM medicines WHERE medicine_id = ?`, [id]);
  return result.affectedRows;
}

/**
 * Joins medicines → prescriptions → visits (3 tables).
 * Returns each medicine with aggregated prescription usage stats
 * and a correlated subquery for the last date it was dispensed.
 */
async function findMedicinesWithUsageStats() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT
      m.medicine_id,
      m.name                                    AS medicine_name,
      m.stock_quantity,
      m.expiration_date,
      COUNT(p.prescription_id)                  AS times_prescribed,
      COALESCE(SUM(p.quantity), 0)              AS total_dispensed,
      COALESCE(ROUND(AVG(p.quantity), 2), 0)    AS avg_per_prescription,
      (
        SELECT MAX(v2.visit_date)
        FROM prescriptions p2
        JOIN visits v2 ON p2.visit_id = v2.visit_id
        WHERE p2.medicine_id = m.medicine_id
      )                                         AS last_dispensed_date
    FROM medicines m
    LEFT JOIN prescriptions p ON m.medicine_id = p.medicine_id
    LEFT JOIN visits        v ON p.visit_id    = v.visit_id
    GROUP BY m.medicine_id, m.name, m.stock_quantity, m.expiration_date
    ORDER BY total_dispensed DESC
  `);
  return rows;
}

module.exports = {
  initMedicinesTable,
  createMedicine,
  findAllMedicines,
  findMedicineById,
  updateMedicine,
  deleteMedicine,
  findMedicinesWithUsageStats,
};
