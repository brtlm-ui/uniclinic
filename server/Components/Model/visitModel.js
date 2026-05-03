const { getDB } = require('../Middleware/dbConnect');

async function initVisitsTable() {
  const db = getDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS visits (
      visit_id   INT(11)      NOT NULL AUTO_INCREMENT PRIMARY KEY,
      student_id INT(11)      NOT NULL,
      staff_id   INT(11)      DEFAULT NULL,
      visit_date DATE         NOT NULL,
      visit_time TIME         NOT NULL,
      reason     TEXT         DEFAULT NULL,
      diagnosis  TEXT         DEFAULT NULL,
      status     ENUM('ongoing','completed') DEFAULT 'ongoing',
      CONSTRAINT fk_visit_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_visit_staff   FOREIGN KEY (staff_id)   REFERENCES staff(staff_id)    ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);
  console.log('visits table ready');
}

async function createVisit({ student_id, staff_id, visit_date, visit_time, reason, diagnosis, status }) {
  const db = getDB();
  const [result] = await db.execute(
    `INSERT INTO visits (student_id, staff_id, visit_date, visit_time, reason, diagnosis, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [student_id, staff_id ?? null, visit_date, visit_time, reason ?? null, diagnosis ?? null, status ?? 'ongoing']
  );
  return result.insertId;
}

async function findAllVisits() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT v.*, 
           CONCAT(s.first_name, ' ', s.last_name) AS student_name,
           st.name AS staff_name
    FROM visits v
    LEFT JOIN students s  ON v.student_id = s.student_id
    LEFT JOIN staff    st ON v.staff_id   = st.staff_id
    ORDER BY v.visit_date DESC, v.visit_time DESC
  `);
  return rows;
}

async function findVisitById(id) {
  const db = getDB();
  const [rows] = await db.execute(`
    SELECT v.*, 
           CONCAT(s.first_name, ' ', s.last_name) AS student_name,
           st.name AS staff_name
    FROM visits v
    LEFT JOIN students s  ON v.student_id = s.student_id
    LEFT JOIN staff    st ON v.staff_id   = st.staff_id
    WHERE v.visit_id = ?
  `, [id]);
  return rows[0] || null;
}

async function updateVisit(id, fields) {
  const db = getDB();
  const allowed = ['student_id', 'staff_id', 'visit_date', 'visit_time', 'reason', 'diagnosis', 'status'];
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
    `UPDATE visits SET ${setClauses.join(', ')} WHERE visit_id = ?`,
    values
  );
  return result.affectedRows;
}

async function deleteVisit(id) {
  const db = getDB();
  const [result] = await db.execute(`DELETE FROM visits WHERE visit_id = ?`, [id]);
  return result.affectedRows;
}

/**
 * Returns visits enriched with prescription counts.
 * 4-table JOIN: visits → students, staff, prescriptions.
 * Aggregation: COUNT, SUM.
 */
async function findVisitsWithPrescriptionCount() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT
      v.visit_id,
      v.visit_date,
      v.visit_time,
      v.reason,
      v.diagnosis,
      v.status,
      CONCAT(s.first_name, ' ', s.last_name)  AS student_name,
      s.student_number,
      s.course,
      s.year_level,
      st.name                                  AS staff_name,
      st.role                                  AS staff_role,
      COUNT(p.prescription_id)                 AS prescription_count,
      COALESCE(SUM(p.quantity), 0)             AS total_medicines_given
    FROM visits v
    LEFT JOIN students      s  ON v.student_id = s.student_id
    LEFT JOIN staff         st ON v.staff_id   = st.staff_id
    LEFT JOIN prescriptions p  ON v.visit_id   = p.visit_id
    GROUP BY
      v.visit_id, v.visit_date, v.visit_time, v.reason, v.diagnosis, v.status,
      s.first_name, s.last_name, s.student_number, s.course, s.year_level,
      st.name, st.role
    ORDER BY v.visit_date DESC, v.visit_time DESC
  `);
  return rows;
}

module.exports = {
  initVisitsTable,
  createVisit,
  findAllVisits,
  findVisitById,
  updateVisit,
  deleteVisit,
  findVisitsWithPrescriptionCount,
};
