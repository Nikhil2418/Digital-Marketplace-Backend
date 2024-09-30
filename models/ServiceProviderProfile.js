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


const serviceProviderProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  email: {
    type: String,
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
  reviews: [reviewSchema], // Add reviews as an array
  averageRating: {
    type: Number,
    default: 0, // Average rating for the provider
  },
  ratingsCount: {
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
