const express = require('express');
const router = express.Router();
const NotificationController = require('../Controller/notificationController');

router.get('/',         NotificationController.getAll);
router.post('/',        NotificationController.create);
router.put('/read-all', NotificationController.markAllRead);  // must be before /:id/read
router.put('/:id/read', NotificationController.markRead);
router.delete('/:id',   NotificationController.delete);

module.exports = router;
