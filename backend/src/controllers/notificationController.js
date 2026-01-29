const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, isRead, page = 1, limit = 20 } = req.query;
    
    const query = { userId };
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === 'true';
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Notification.countDocuments(query);
    
    return successResponse(res, {
      notifications,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    }, 'Notifications retrieved successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Notification.getUnreadCount(userId);
    
    return successResponse(res, { count }, 'Unread count retrieved successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const notification = await Notification.findOne({ _id: id, userId });
    
    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }
    
    await notification.markAsRead();
    
    return successResponse(res, notification, 'Notification marked as read');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Notification.markAllAsRead(userId);
    
    return successResponse(res, { modifiedCount: result.modifiedCount }, 'All notifications marked as read');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const notification = await Notification.findOneAndDelete({ _id: id, userId });
    
    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }
    
    return successResponse(res, null, 'Notification deleted successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Create notification (internal use)
exports.createNotification = async (userId, type, title, message, data = {}) => {
  try {
    return await Notification.createNotification(userId, type, title, message, data);
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

module.exports = exports;
