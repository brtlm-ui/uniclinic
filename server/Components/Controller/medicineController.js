const {
  createMedicine,
  findAllMedicines,
  findMedicineById,
  updateMedicine,
  deleteMedicine,
} = require('../Model/medicineModel');

const MedicineController = {

  // GET ALL
  getAllMedicines: async (request, response) => {
    try {
      const medicines = await findAllMedicines();
      response.json(medicines);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // GET ONE
  getMedicineById: async (request, response) => {
    try {
      const medicine = await findMedicineById(request.params.id);
      if (!medicine) return response.status(404).json({ message: 'Medicine not found' });
      response.json(medicine);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // CREATE
  createMedicine: async (request, response) => {
    try {
      const { name, stock_quantity, expiration_date } = request.body;
      if (!name) return response.status(400).json({ message: 'name is required' });
      const insertId = await createMedicine({ name, stock_quantity, expiration_date });
      response.status(201).json({ message: 'Medicine created', data: { medicine_id: insertId, ...request.body } });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // UPDATE
  updateMedicine: async (request, response) => {
    try {
      const affected = await updateMedicine(request.params.id, request.body);
      if (affected === 0) return response.status(404).json({ message: 'Medicine not found' });
      response.json({ message: 'Medicine updated' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // DELETE
  deleteMedicine: async (request, response) => {
    try {
      const affected = await deleteMedicine(request.params.id);
      if (affected === 0) return response.status(404).json({ message: 'Medicine not found' });
      response.json({ message: 'Medicine deleted' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },
};

module.exports = MedicineController;
