const {
  findAllNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../Model/notificationModel');

const NotificationController = {

  // GET ALL
  getAll: async (req, res) => {
    try {
      const data = await findAllNotifications();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // CREATE (manual)
  create: async (req, res) => {
    try {
      const { type, icon, title, description } = req.body;
      if (!title) return res.status(400).json({ message: 'title is required' });
      const id = await createNotification({ type, icon, title, description });
      res.status(201).json({ message: 'Notification created', notification_id: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /:id/read
  markRead: async (req, res) => {
    try {
      const affected = await markAsRead(req.params.id);
      if (affected === 0) return res.status(404).json({ message: 'Notification not found' });
      res.json({ message: 'Marked as read' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /read-all
  markAllRead: async (req, res) => {
    try {
      await markAllAsRead();
      res.json({ message: 'All notifications marked as read' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /:id
  delete: async (req, res) => {
    try {
      const affected = await deleteNotification(req.params.id);
      if (affected === 0) return res.status(404).json({ message: 'Notification not found' });
      res.json({ message: 'Notification deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = NotificationController;
