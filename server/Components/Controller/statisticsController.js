const {
  getDashboardSummary,
  getMedicineUsageStats,
  getVisitDetailStats,
  getMonthlyTrends,
  getStudentVisitStats,
  getStaffActivityStats,
} = require('../Model/statisticsModel');

const StatisticsController = {

  // GET /api/statistics/dashboard
  // Returns aggregate counts for the dashboard (students, visits, medicines, staff, etc.)
  getDashboard: async (req, res) => {
    try {
      const summary = await getDashboardSummary();
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/statistics/medicines
  // Returns each medicine with prescription counts, total/avg dispensed, last dispensed date
  getMedicineStats: async (req, res) => {
    try {
      const stats = await getMedicineUsageStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/statistics/visits
  // Returns visits enriched with student/staff info and per-visit prescription totals
  getVisitStats: async (req, res) => {
    try {
      const stats = await getVisitDetailStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/statistics/monthly-trends
  // Returns month-by-month visit + medicine dispensing totals (last 12 months)
  getMonthlyTrends: async (req, res) => {
    try {
      const trends = await getMonthlyTrends();
      res.json(trends);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/statistics/students
  // Returns each student with total/completed visits, date range, and medicines received
  getStudentStats: async (req, res) => {
    try {
      const stats = await getStudentVisitStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/statistics/staff
  // Returns each staff member with visits handled, unique patients seen, medicines dispensed
  getStaffStats: async (req, res) => {
    try {
      const stats = await getStaffActivityStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = StatisticsController;
