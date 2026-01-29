const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['transaction', 'promotion', 'security', 'referral', 'bill', 'system'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

// Compound indexes
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });

// TTL index for auto-deletion of expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Methods
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  return await this.save();
};

// Statics
notificationSchema.statics.createNotification = async function(userId, type, title, message, data = {}) {
  return await this.create({
    userId,
    type,
    title,
    message,
    data
  });
};

notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } }
  );
};

notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ userId, isRead: false });
};

notificationSchema.statics.deleteOld = async function(userId, days = 30) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return await this.deleteMany({
    userId,
    createdAt: { $lt: cutoffDate }
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
