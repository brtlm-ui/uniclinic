const express = require('express');
const router = express.Router();
const PrescriptionController = require('../Controller/prescriptionController');

router.get('/',                       PrescriptionController.getAllPrescriptions);
router.get('/visit/:visitId',         PrescriptionController.getPrescriptionsByVisit);
router.get('/:id',                    PrescriptionController.getPrescriptionById);
router.post('/',                      PrescriptionController.createPrescription);
router.put('/:id',                    PrescriptionController.updatePrescription);
router.delete('/:id',                 PrescriptionController.deletePrescription);

module.exports = router;
