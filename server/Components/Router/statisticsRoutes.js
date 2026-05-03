const express = require('express');
const router  = express.Router();
const StatisticsController = require('../Controller/statisticsController');

router.get('/dashboard',      StatisticsController.getDashboard);
router.get('/medicines',      StatisticsController.getMedicineStats);
router.get('/visits',         StatisticsController.getVisitStats);
router.get('/monthly-trends', StatisticsController.getMonthlyTrends);
router.get('/students',       StatisticsController.getStudentStats);
router.get('/staff',          StatisticsController.getStaffStats);

module.exports = router;
