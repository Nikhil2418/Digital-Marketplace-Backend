const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skills: {
    type: [String], // Array of strings to store skills
    required: true,
  },
  budget: {
    type: Number, // Replaces the previous "price" field
    required: true,
  },
  country: {
    type: String, // Country field to store the location of the service
    required: true,
  },
  duration: {
    type: String, // Duration of the service
    required: true,
  },
  timeCommitment: {
    type: String, // Time commitment for the service
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the service provider
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the customer who booked the service
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Expert'],
    default: 'Beginner',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Paid'], // Track service status
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Pending', 'Paid'], // Track the payment status
    default: 'Unpaid',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', serviceSchema);
