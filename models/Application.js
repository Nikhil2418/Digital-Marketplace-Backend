const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewDate: {
      type: Date,
      default: Date.now,
    },
  });


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
  customerId: { // Make sure this field exists in your schema if you want to use it
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviews: [reviewSchema],
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
