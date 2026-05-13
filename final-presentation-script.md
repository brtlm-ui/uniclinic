# UniClinic Final Presentation Script

## 3–5 Minute Video Guide

Good day. I’m [Your Name], and this is **UniClinic**, a University Clinic Management System for our Advanced Database Systems final project. This system was designed to help clinic staff manage student visits, medicines, prescriptions, treatments, and staff records in one centralized platform.

For this presentation, I will show the main system features, explain the database tables, and demonstrate the SQL concepts required by the professor: aggregation functions, JOINs, subqueries, and a CTE.

### 1. Login System

I’ll start with the login page. Staff members enter their username and password, and the system authenticates them before allowing access to the main dashboard. This satisfies the required login system feature.

### 2. Dashboard

After logging in, the user is taken to the Dashboard. This page shows live summary statistics powered by SQL in [statisticsModel.js](server/Components/Model/statisticsModel.js#L11-L34). The dashboard query uses a **Common Table Expression** called `monthly_visits`, then uses multiple subqueries to retrieve totals in a single request.

The exact query starts like this:

```sql
WITH monthly_visits AS (
	SELECT DATE_FORMAT(visit_date, '%Y-%m') AS month, COUNT(*) AS visit_count
	FROM visits
	GROUP BY DATE_FORMAT(visit_date, '%Y-%m')
)
SELECT
	(SELECT COUNT(*) FROM students) AS total_students,
	(SELECT COUNT(*) FROM visits) AS total_visits,
	(SELECT COALESCE(SUM(stock_quantity), 0) FROM medicines) AS total_stock,
	(SELECT ROUND(AVG(visit_count), 2) FROM monthly_visits) AS avg_monthly_visits,
	(SELECT MAX(visit_count) FROM monthly_visits) AS peak_monthly_visits,
	(SELECT MIN(visit_count) FROM monthly_visits) AS min_monthly_visits
```

This is where the required aggregation functions are demonstrated:

- `COUNT()` for totals like students, visits, medicines, prescriptions, and staff
- `SUM()` for stock and medicine totals
- `AVG()` for average monthly visits
- `MAX()` for the peak monthly visits
- `MIN()` for the minimum monthly visits

This query is a good example of how SQL can combine multiple calculations into one efficient dashboard summary.

### 3. Database Tables

UniClinic uses **8 database tables**, which satisfies the requirement of at least five entities. These tables are:

- `students` — stores student information such as name, course, year level, and student number
- `staff` — stores clinic personnel information
- `visits` — stores clinic visit records
- `medicines` — stores medicine inventory data
- `prescriptions` — stores which medicines were given during a visit
- `treatments` — stores treatments applied during visits
- `notifications` — stores alerts and system notifications
- `users` — stores login credentials for authentication

These tables are linked through foreign keys and support the full workflow of the system.

### 4. Visits Module and JOINs

Next, I’ll show the Visits page. This page displays clinic visit records and uses SQL to combine related data from multiple tables. The live query behind this page is in [statisticsModel.js](server/Components/Model/statisticsModel.js#L82-L123), inside `getVisitDetailStats()`. It loads visit details together with student and staff information, and it also includes prescription details for each visit.

The query returns fields like `visit_id`, `student_name`, `staff_name`, `prescriptions`, `prescription_count`, and `total_medicines_given`.

If a visit has no prescribed medicine yet, the table shows **None**. If a visit has multiple prescriptions, they stack vertically in the prescriptions column so the row grows dynamically.

For a separate JOIN example in the backend, [visitModel.js](server/Components/Model/visitModel.js#L93-L124) contains a **4-table JOIN** in `findVisitsWithPrescriptionCount()`. This is a strong example of relational querying and satisfies the JOIN requirement.

The query looks like this:

```sql
SELECT
	v.visit_id,
	v.visit_date,
	v.visit_time,
	v.reason,
	v.diagnosis,
	v.status,
	CONCAT(s.first_name, ' ', s.last_name) AS student_name,
	s.student_number,
	s.course,
	s.year_level,
	st.name AS staff_name,
	st.role AS staff_role,
	COUNT(p.prescription_id) AS prescription_count,
	COALESCE(SUM(p.quantity), 0) AS total_medicines_given
FROM visits v
LEFT JOIN students s ON v.student_id = s.student_id
LEFT JOIN staff st ON v.staff_id = st.staff_id
LEFT JOIN prescriptions p ON v.visit_id = p.visit_id
```

### 5. Subqueries and Reports

The system also includes additional subqueries in the statistics module. For example, [statisticsModel.js](server/Components/Model/statisticsModel.js#L163-L181) contains a correlated subquery that calculates the total medicines received by each student. This demonstrates how a subquery can reference values from the outer query.

The correlated subquery is:

```sql
(
	SELECT COALESCE(SUM(p.quantity), 0)
	FROM prescriptions p
	INNER JOIN visits v2 ON p.visit_id = v2.visit_id
	WHERE v2.student_id = s.student_id
) AS total_medicines_received
```

The Reports page uses the data generated by these SQL queries to present meaningful clinic analytics. This satisfies the required report page feature.

### 6. CRUD, Search, and Filter Features

UniClinic also includes full CRUD operations across the main modules. Staff can add, edit, and delete records for students, visits, medicines, prescriptions, treatments, and staff.

Every major list page includes search and filter functionality, so users can quickly find the record they need.

### 7. Closing

In summary, UniClinic is built with **React** on the frontend, **Node.js and Express** on the backend, and **MySQL** for the database. It meets the project requirements by including a login system, CRUD operations, search and filter functionality, a dashboard, a report page, and the required SQL concepts: aggregation functions, JOINs, subqueries, and a CTE.

For submission, I will upload the video presentation along with a text or document file containing the GitHub repository link.

Thank you for watching.
