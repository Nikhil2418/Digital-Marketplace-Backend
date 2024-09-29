const mongoose = require('mongoose');

const serviceProviderProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
  },
  languages: {
    type: [String], // Array of languages known by the provider
    default: [],
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  timeZone: {
    type: String, // Time zone of the provider
  },
  ratings: {
    type: Number, // Overall client rating
    default: 0,
  },
  paymentVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  jobsPosted: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ServiceProviderProfile', serviceProviderProfileSchema);
