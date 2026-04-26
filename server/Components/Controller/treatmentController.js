const {
  createTreatment,
  findAllTreatments,
  findTreatmentById,
  findTreatmentsByVisit,
  updateTreatment,
  deleteTreatment,
} = require('../Model/treatmentModel');

const TreatmentController = {

  // GET ALL
  getAllTreatments: async (request, response) => {
    try {
      const treatments = await findAllTreatments();
      response.json(treatments);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // GET BY VISIT
  getTreatmentsByVisit: async (request, response) => {
    try {
      const treatments = await findTreatmentsByVisit(request.params.visitId);
      response.json(treatments);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // GET ONE
  getTreatmentById: async (request, response) => {
    try {
      const treatment = await findTreatmentById(request.params.id);
      if (!treatment) return response.status(404).json({ message: 'Treatment not found' });
      response.json(treatment);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // CREATE
  createTreatment: async (request, response) => {
    try {
      const { visit_id, treatment_given, notes } = request.body;
      if (!visit_id || !treatment_given) {
        return response.status(400).json({ message: 'visit_id and treatment_given are required' });
      }
      const insertId = await createTreatment({ visit_id, treatment_given, notes });
      response.status(201).json({ message: 'Treatment created', data: { treatment_id: insertId, ...request.body } });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // UPDATE
  updateTreatment: async (request, response) => {
    try {
      const affected = await updateTreatment(request.params.id, request.body);
      if (affected === 0) return response.status(404).json({ message: 'Treatment not found' });
      response.json({ message: 'Treatment updated' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // DELETE
  deleteTreatment: async (request, response) => {
    try {
      const affected = await deleteTreatment(request.params.id);
      if (affected === 0) return response.status(404).json({ message: 'Treatment not found' });
      response.json({ message: 'Treatment deleted' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },
};

module.exports = TreatmentController;
