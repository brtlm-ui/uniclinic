const {
  createVisit,
  findAllVisits,
  findVisitById,
  updateVisit,
  deleteVisit,
} = require('../Model/visitModel');

const VisitController = {

  // GET ALL
  getAllVisits: async (request, response) => {
    try {
      const visits = await findAllVisits();
      response.json(visits);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // GET ONE
  getVisitById: async (request, response) => {
    try {
      const visit = await findVisitById(request.params.id);
      if (!visit) return response.status(404).json({ message: 'Visit not found' });
      response.json(visit);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // CREATE
  createVisit: async (request, response) => {
    try {
      const { student_id, staff_id, visit_date, visit_time, reason, diagnosis, status } = request.body;
      if (!student_id || !visit_date || !visit_time) {
        return response.status(400).json({ message: 'student_id, visit_date and visit_time are required' });
      }
      const insertId = await createVisit({ student_id, staff_id, visit_date, visit_time, reason, diagnosis, status });
      response.status(201).json({ message: 'Visit created', data: { visit_id: insertId, ...request.body } });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // UPDATE
  updateVisit: async (request, response) => {
    try {
      const affected = await updateVisit(request.params.id, request.body);
      if (affected === 0) return response.status(404).json({ message: 'Visit not found' });
      response.json({ message: 'Visit updated' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // DELETE
  deleteVisit: async (request, response) => {
    try {
      const affected = await deleteVisit(request.params.id);
      if (affected === 0) return response.status(404).json({ message: 'Visit not found' });
      response.json({ message: 'Visit deleted' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },
};

module.exports = VisitController;
