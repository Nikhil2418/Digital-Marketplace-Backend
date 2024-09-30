const mongoose = require('mongoose');
const { Schema } = mongoose;

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

// Define the CustomerProfile schema
const customerProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // URL to the profile picture
  },
  location: {
    type: String,
  },
  summary: {
    type: String, // Brief description or summary of the customer
    maxlength: 2000, // Set a limit to the length
  },
  hourlyRate: {
    type: Number,
    default: 0,
  },
  availability: {
    type: String, // e.g., 'Less than 30 hrs/week'
  },
  languages: {
    type: [String], // Array of languages, e.g., ['English: Fluent', 'Spanish: Intermediate']
  },
  skills: {
    type: [String], // Array of skills, e.g., ['JavaScript', 'React', 'Node.js']
  },
  education: [
    {
      institution: { type: String },
      degree: { type: String },
      fieldOfStudy: { type: String },
      startYear: { type: String },
      endYear: { type: String },
    },
  ],
  workHistory: [
    {
      company: { type: String },
      position: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      description: { type: String },
    },
  ],
  portfolio: [
    {
      title: { type: String },
      description: { type: String },
      projectUrl: { type: String },
      imageUrl: { type: String }, // Optional image associated with the project
    },
  ],
  linkedAccounts: [
    {
      platform: { type: String }, // e.g., 'GitHub', 'LinkedIn'
      url: { type: String }, // URL to the linked account
    },
  ],
  verifications: [
    {
      type: { type: String }, // Type of verification, e.g., 'ID', 'Email'
      status: { type: String }, // Verification status, e.g., 'Verified'
    },
  ],

  reviews: [reviewSchema], // Add reviews as an array
  averageRating: {
    type: Number,
    default: 0, // Average rating for the customer
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

// Update the `updatedAt` field before saving the document
customerProfileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the model
module.exports = mongoose.model('CustomerProfile', customerProfileSchema);
