const express = require('express');
const router = express.Router();
const MedicineController = require('../Controller/medicineController');

router.get('/',    MedicineController.getAllMedicines);
router.get('/:id', MedicineController.getMedicineById);
router.post('/',   MedicineController.createMedicine);
router.put('/:id', MedicineController.updateMedicine);
router.delete('/:id', MedicineController.deleteMedicine);

module.exports = router;
