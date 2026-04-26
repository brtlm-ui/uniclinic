const express = require('express');
const router = express.Router();
const VisitController = require('../Controller/visitController');

router.get('/',                          VisitController.getAllVisits);
router.get('/:id',                       VisitController.getVisitById);
router.post('/',                         VisitController.createVisit);
router.put('/:id',                       VisitController.updateVisit);
router.delete('/:id',                    VisitController.deleteVisit);

module.exports = router;
