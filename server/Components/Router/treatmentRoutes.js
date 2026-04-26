const express = require('express');
const router = express.Router();
const TreatmentController = require('../Controller/treatmentController');

router.get('/',                     TreatmentController.getAllTreatments);
router.get('/visit/:visitId',       TreatmentController.getTreatmentsByVisit);
router.get('/:id',                  TreatmentController.getTreatmentById);
router.post('/',                    TreatmentController.createTreatment);
router.put('/:id',                  TreatmentController.updateTreatment);
router.delete('/:id',               TreatmentController.deleteTreatment);

module.exports = router;
