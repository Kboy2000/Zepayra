const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// All routes are protected
router.use(protect);

// GET /api/notifications - Get user notifications
router.get('/', notificationController.getNotifications);

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// PUT /api/notifications/read-all - Mark all as read
router.put('/read-all', notificationController.markAllAsRead);

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', notificationController.markAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
