const { getDB } = require('../db');
const { validateUser } = require('../Model/userModel');

const UserController = {

    // GET ALL USERS
    getAllUsers: async (req, res) => {
        try {
            const errors = validateUser(req.body);
            
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // CREATE
    registerUser: async (req, res) {
        try {
            const errors = validateUser(req.body);

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const db = getDB();

            const [result] = await db.execute(
                `INSERT INTO users (username, email, password)
         VALUES (?, ?, ?)`,
                [req.body.username, req.body.email, req.body.password]
            );

            res.status(201).json({
                message: 'User created',
                data: {
                    id: result.insertId,
                    ...req.body
                }
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // READ ALL
    static async getAll(req, res) {
        try {
            const db = getDB();
            const [rows] = await db.query('SELECT * FROM users');

            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

  // READ ONE
  static async getById(req, res) {
        try {
            const db = getDB();

            const [rows] = await db.query(
                'SELECT * FROM users WHERE id = ?',
                [req.params.id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(rows[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

  // DELETE
  static async delete(req, res) {
        try {
            const db = getDB();

            await db.query(
                'DELETE FROM users WHERE id = ?',
                [req.params.id]
            );

            res.json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = User;