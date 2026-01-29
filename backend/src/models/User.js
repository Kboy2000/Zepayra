const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, jwtOptions } = require('../config/jwt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [
        /^(0|\+234)[7-9][0-1]\d{8}$/,
        'Please provide a valid Nigerian phone number',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    transactionPin: {
      type: String,
      select: false, // Don't return PIN by default
      minlength: [4, 'Transaction PIN must be 4 digits'],
      maxlength: [4, 'Transaction PIN must be 4 digits'],
    },
    hasPinSet: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password and transaction PIN before saving
userSchema.pre('save', async function (next) {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Hash transaction PIN if modified
  if (this.isModified('transactionPin') && this.transactionPin) {
    const salt = await bcrypt.genSalt(12);
    this.transactionPin = await bcrypt.hash(this.transactionPin, salt);
    this.hasPinSet = true;
  }

  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Compare transaction PIN method
userSchema.methods.compareTransactionPin = async function (candidatePin) {
  if (!this.transactionPin) {
    return false;
  }
  return await bcrypt.compare(candidatePin, this.transactionPin);
};

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, jwtOptions);
};

// Get user full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

module.exports = mongoose.model('User', userSchema);
