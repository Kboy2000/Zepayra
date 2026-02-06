const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['airtime', 'data', 'electricity', 'tv', 'education'],
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    variations: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSynced: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
serviceSchema.index({ serviceId: 1 });
serviceSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
