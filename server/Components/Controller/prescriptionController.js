const {
  createPrescription,
  findAllPrescriptions,
  findPrescriptionById,
  findPrescriptionsByVisit,
  updatePrescription,
  deletePrescription,
} = require('../Model/prescriptionModel');

const PrescriptionController = {

  // GET ALL
  getAllPrescriptions: async (request, response) => {
    try {
      const prescriptions = await findAllPrescriptions();
      response.json(prescriptions);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // GET BY VISIT
  getPrescriptionsByVisit: async (request, response) => {
    try {
      const prescriptions = await findPrescriptionsByVisit(request.params.visitId);
      response.json(prescriptions);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // GET ONE
  getPrescriptionById: async (request, response) => {
    try {
      const prescription = await findPrescriptionById(request.params.id);
      if (!prescription) return response.status(404).json({ message: 'Prescription not found' });
      response.json(prescription);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // CREATE
  createPrescription: async (request, response) => {
    try {
      const { visit_id, medicine_id, quantity } = request.body;
      if (!visit_id || !medicine_id || quantity == null) {
        return response.status(400).json({ message: 'visit_id, medicine_id and quantity are required' });
      }
      const insertId = await createPrescription({ visit_id, medicine_id, quantity });
      response.status(201).json({ message: 'Prescription created', data: { prescription_id: insertId, ...request.body } });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // UPDATE
  updatePrescription: async (request, response) => {
    try {
      const affected = await updatePrescription(request.params.id, request.body);
      if (affected === 0) return response.status(404).json({ message: 'Prescription not found' });
      response.json({ message: 'Prescription updated' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // DELETE
  deletePrescription: async (request, response) => {
    try {
      const affected = await deletePrescription(request.params.id);
      if (affected === 0) return response.status(404).json({ message: 'Prescription not found' });
      response.json({ message: 'Prescription deleted' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },
};

module.exports = PrescriptionController;
