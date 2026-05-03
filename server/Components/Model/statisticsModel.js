const { getDB } = require('../Middleware/dbConnect');

// ─────────────────────────────────────────────────────────────────────────────
// getDashboardSummary
// ─────────────────────────────────────────────────────────────────────────────
// SQL Features used:
//   • CTE (monthly_visits) — computes per-month visit counts once and reuses it
//   • Aggregation: COUNT, SUM, AVG, MAX, MIN
//   • Subqueries: each SELECT scalar in the outer query is a subquery (10+)
// ─────────────────────────────────────────────────────────────────────────────
async function getDashboardSummary() {
  const db = getDB();
  const [rows] = await db.query(`
    WITH monthly_visits AS (
      SELECT
        DATE_FORMAT(visit_date, '%Y-%m') AS month,
        COUNT(*)                          AS visit_count
      FROM visits
      GROUP BY DATE_FORMAT(visit_date, '%Y-%m')
    )
    SELECT
      (SELECT COUNT(*)                        FROM students)                              AS total_students,
      (SELECT COUNT(*)                        FROM visits)                                AS total_visits,
      (SELECT COUNT(*)                        FROM visits   WHERE status = 'ongoing')     AS ongoing_visits,
      (SELECT COUNT(*)                        FROM visits   WHERE status = 'completed')   AS completed_visits,
      (SELECT COUNT(*)                        FROM medicines)                             AS total_medicines,
      (SELECT COALESCE(SUM(stock_quantity),0) FROM medicines)                             AS total_stock,
      (SELECT COUNT(*)                        FROM medicines WHERE stock_quantity <= 20)  AS low_stock_count,
      (SELECT COUNT(*)                        FROM medicines WHERE stock_quantity = 0)    AS out_of_stock_count,
      (SELECT COUNT(*)                        FROM staff)                                 AS total_staff,
      (SELECT COUNT(*)                        FROM prescriptions)                         AS total_prescriptions,
      (SELECT COUNT(*)                        FROM treatments)                            AS total_treatments,
      COALESCE((SELECT ROUND(AVG(visit_count), 2) FROM monthly_visits), 0)               AS avg_monthly_visits,
      COALESCE((SELECT MAX(visit_count)           FROM monthly_visits), 0)               AS peak_monthly_visits,
      COALESCE((SELECT MIN(visit_count)           FROM monthly_visits), 0)               AS min_monthly_visits
  `);
  return rows[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// getMedicineUsageStats
// ─────────────────────────────────────────────────────────────────────────────
// SQL Features used:
//   • 3-table JOIN: medicines ← prescriptions → visits
//   • Aggregation: COUNT, SUM, AVG
//   • Correlated subquery to find last dispensed date per medicine
// ─────────────────────────────────────────────────────────────────────────────
async function getMedicineUsageStats() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT
      m.medicine_id,
      m.name                                     AS medicine_name,
      m.stock_quantity,
      m.expiration_date,
      COUNT(p.prescription_id)                   AS times_prescribed,
      COALESCE(SUM(p.quantity), 0)               AS total_dispensed,
      COALESCE(ROUND(AVG(p.quantity), 2), 0)     AS avg_per_prescription,
      (
        SELECT MAX(v2.visit_date)
        FROM prescriptions p2
        JOIN visits v2 ON p2.visit_id = v2.visit_id
        WHERE p2.medicine_id = m.medicine_id
      )                                          AS last_dispensed_date
    FROM medicines m
    LEFT JOIN prescriptions p ON m.medicine_id = p.medicine_id
    LEFT JOIN visits        v ON p.visit_id    = v.visit_id
    GROUP BY m.medicine_id, m.name, m.stock_quantity, m.expiration_date
    ORDER BY total_dispensed DESC
  `);
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// getVisitDetailStats
// ─────────────────────────────────────────────────────────────────────────────
// SQL Features used:
//   • 4-table JOIN: visits ← students, staff, prescriptions
//   • Aggregation: COUNT, SUM
// ─────────────────────────────────────────────────────────────────────────────
async function getVisitDetailStats() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT
      v.visit_id,
      v.visit_date,
      v.visit_time,
      v.status,
      v.reason,
      v.diagnosis,
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
      v.visit_id, v.visit_date, v.visit_time, v.status, v.reason, v.diagnosis,
      s.first_name, s.last_name, s.student_number, s.course, s.year_level,
      st.name, st.role
    ORDER BY v.visit_date DESC, v.visit_time DESC
  `);
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// getMonthlyTrends
// ─────────────────────────────────────────────────────────────────────────────
// SQL Features used:
//   • JOIN: visits ← prescriptions
//   • Aggregation: COUNT (DISTINCT), SUM, CASE expressions
//   • Returns last 12 months
// ─────────────────────────────────────────────────────────────────────────────
async function getMonthlyTrends() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT
      DATE_FORMAT(v.visit_date, '%Y-%m')                       AS month,
      COUNT(DISTINCT v.visit_id)                                AS total_visits,
      COUNT(DISTINCT v.student_id)                              AS unique_students,
      SUM(CASE WHEN v.status = 'completed' THEN 1 ELSE 0 END)  AS completed_visits,
      SUM(CASE WHEN v.status = 'ongoing'   THEN 1 ELSE 0 END)  AS ongoing_visits,
      COALESCE(SUM(p.quantity), 0)                              AS medicines_dispensed
    FROM visits v
    LEFT JOIN prescriptions p ON v.visit_id = p.visit_id
    GROUP BY DATE_FORMAT(v.visit_date, '%Y-%m')
    ORDER BY month DESC
    LIMIT 12
  `);
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// getStudentVisitStats
// ─────────────────────────────────────────────────────────────────────────────
// SQL Features used:
//   • JOIN: students ← visits
//   • Aggregation: COUNT, MAX, MIN, SUM (via CASE)
//   • Correlated subquery: total medicines received per student
// ─────────────────────────────────────────────────────────────────────────────
async function getStudentVisitStats() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT
      s.student_id,
      s.student_number,
      CONCAT(s.first_name, ' ', s.last_name)                   AS student_name,
      s.course,
      s.year_level,
      COUNT(v.visit_id)                                         AS total_visits,
      COALESCE(MAX(v.visit_date), NULL)                         AS last_visit_date,
      COALESCE(MIN(v.visit_date), NULL)                         AS first_visit_date,
      SUM(CASE WHEN v.status = 'completed' THEN 1 ELSE 0 END)  AS completed_visits,
      (
        SELECT COALESCE(SUM(p.quantity), 0)
        FROM prescriptions p
        INNER JOIN visits v2 ON p.visit_id = v2.visit_id
        WHERE v2.student_id = s.student_id
      )                                                         AS total_medicines_received
    FROM students s
    LEFT JOIN visits v ON s.student_id = v.student_id
    GROUP BY s.student_id, s.student_number, s.first_name, s.last_name,
             s.course, s.year_level
    ORDER BY total_visits DESC
  `);
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// getStaffActivityStats
// ─────────────────────────────────────────────────────────────────────────────
// SQL Features used:
//   • JOIN: staff ← visits ← students (3 tables)
//   • Aggregation: COUNT (DISTINCT), MAX
//   • Correlated subquery: total medicines dispensed per staff member
// ─────────────────────────────────────────────────────────────────────────────
async function getStaffActivityStats() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT
      st.staff_id,
      st.name                                                   AS staff_name,
      st.role,
      COUNT(DISTINCT v.visit_id)                                AS visits_handled,
      COUNT(DISTINCT v.student_id)                              AS unique_students_seen,
      COALESCE(MAX(v.visit_date), NULL)                         AS last_activity_date,
      (
        SELECT COALESCE(SUM(p.quantity), 0)
        FROM prescriptions p
        INNER JOIN visits v2 ON p.visit_id = v2.visit_id
        WHERE v2.staff_id = st.staff_id
      )                                                         AS total_medicines_dispensed
    FROM staff st
    LEFT JOIN visits v ON st.staff_id = v.staff_id
    GROUP BY st.staff_id, st.name, st.role
    ORDER BY visits_handled DESC
  `);
  return rows;
}

module.exports = {
  getDashboardSummary,
  getMedicineUsageStats,
  getVisitDetailStats,
  getMonthlyTrends,
  getStudentVisitStats,
  getStaffActivityStats,
};
