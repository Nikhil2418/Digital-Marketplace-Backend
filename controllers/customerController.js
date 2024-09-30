// controllers/customerController.js
const CustomerProfile = require('../models/CustomerProfile');

exports.getAllCustomerProfiles = async (req, res) => {
  try {
    // Fetch all customer profiles and populate reviews and user details
    const customers = await CustomerProfile.find()
      .populate('userId', 'name email')
      .populate('reviews.reviewedBy', 'name');

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer profiles', error });
  }
};
