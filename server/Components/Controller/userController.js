const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SALT, SECRET_KEY } = require('../Config/config');
const {
  validateStaff,
  createStaff,
  findAllStaff,
  findStaffById,
  findStaffByUsername,
  updateStaff,
  deleteStaff,
  updateLastActive,
} = require('../Model/userModel');

const SALT_ROUNDS = Number.isFinite(SALT) ? SALT : 10;

const UserController = {

  // LOGIN
  loginUser: async (request, response) => {
    try {
      const { username, password } = request.body;

      if (!username || !password) {
        return response.status(400).json({ message: 'Username and password are required' });
      }

      const staff = await findStaffByUsername(username);
      if (!staff) {
        return response.status(401).json({ message: 'Invalid credentials' });
      }

      const match = await bcrypt.compare(password, staff.password);
      if (!match) {
        return response.status(401).json({ message: 'Invalid credentials' });
      }

      // Record the login timestamp
      await updateLastActive(staff.staff_id);

      const token = jwt.sign(
        { id: staff.staff_id, name: staff.name, role: staff.role },
        SECRET_KEY,
        { expiresIn: '24h' }
      );

      const { password: _pw, ...safeStaff } = staff;
      response.status(200).json({ message: 'Login successful', token, data: safeStaff });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // GET ALL STAFF
  getAllStaff: async (request, response) => {
    try {
      const staff = await findAllStaff();
      response.json(staff);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // GET ONE STAFF
  getStaffById: async (request, response) => {
    try {
      const staff = await findStaffById(request.params.id);
      if (!staff) {
        return response.status(404).json({ message: 'Staff not found' });
      }
      response.json(staff);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // CREATE STAFF
  registerStaff: async (request, response) => {
    try {
      const errors = validateStaff(request.body);
      if (errors.length > 0) {
        return response.status(400).json({ errors });
      }

      const { name, role, username, password } = request.body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const insertId = await createStaff({ name, role, username, password: hashedPassword });

      response.status(201).json({
        message: 'Staff created',
        data: { staff_id: insertId, name, role, username },
      });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // UPDATE STAFF
  updateStaff: async (request, response) => {
    try {
      const fields = { ...request.body };

      if (fields.password) {
        fields.password = await bcrypt.hash(fields.password, SALT_ROUNDS);
      }

      const affected = await updateStaff(request.params.id, fields);
      if (affected === 0) {
        return response.status(404).json({ message: 'Staff not found' });
      }
      response.json({ message: 'Staff updated' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },

  // DELETE STAFF
  deleteStaff: async (request, response) => {
    try {
      const affected = await deleteStaff(request.params.id);
      if (affected === 0) {
        return response.status(404).json({ message: 'Staff not found' });
      }
      response.json({ message: 'Staff deleted' });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },
};

module.exports = UserController;