const {
  createStudent,
  findAllStudents,
  findStudentById,
  updateStudent,
  deleteStudent,
} = require('../Model/studentModel');

const StudentController = {

  // GET ALL
  getAllStudents: async (request, response) => {
    try {
      const students = await findAllStudents();
      response.json(students);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // GET ONE
  getStudentById: async (request, response) => {
    try {
      const student = await findStudentById(request.params.id);
      if (!student) return response.status(404).json({ message: 'Student not found' });
      response.json(student);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // CREATE
  createStudent: async (request, response) => {
    try {
      const { student_number, first_name, last_name, course, year_level, contact_number } = request.body;
      if (!student_number || !first_name || !last_name) {
        return response.status(400).json({ message: 'student_number, first_name and last_name are required' });
      }
      const insertId = await createStudent({ student_number, first_name, last_name, course, year_level, contact_number });
      response.status(201).json({ message: 'Student created', data: { student_id: insertId, ...request.body } });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // UPDATE
  updateStudent: async (request, response) => {
    try {
      const affected = await updateStudent(request.params.id, request.body);
      if (affected === 0) return response.status(404).json({ message: 'Student not found' });
      response.json({ message: 'Student updated' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // DELETE
  deleteStudent: async (request, response) => {
    try {
      const affected = await deleteStudent(request.params.id);
      if (affected === 0) return response.status(404).json({ message: 'Student not found' });
      response.json({ message: 'Student deleted' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },
};

module.exports = StudentController;
