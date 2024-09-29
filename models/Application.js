const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'In Progress', 'Rejected', 'Cancelled', 'Completed', 'Payment Received'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', applicationSchema);
