// controllers/reviewController.js
const ServiceProviderProfile = require('../models/ServiceProviderProfile');
const CustomerProfile = require('../models/CustomerProfile');

exports.addReview = async (req, res) => {
  try {
    const { profileId, profileType } = req.params; // `profileType` can be 'customer' or 'service-provider'
    const { reviewText, rating } = req.body;

    let ProfileModel;
    if (profileType === 'customer') {
      ProfileModel = CustomerProfile;
    } else if (profileType === 'service-provider') {
      ProfileModel = ServiceProviderProfile;
    } else {
      return res.status(400).json({ message: 'Invalid profile type' });
    }

    // Find the profile by userId
    const profile = await ProfileModel.findOne({ userId: profileId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Create new review
    const newReview = {
      reviewedBy: req.user.id,
      reviewText,
      rating,
    };

    // Calculate new average rating
    profile.reviews.push(newReview);
    profile.ratingsCount += 1;
    profile.averageRating =
      profile.reviews.reduce((acc, review) => acc + review.rating, 0) / profile.ratingsCount;

    await profile.save();

    res.json({ message: 'Review added successfully', profile });
  } catch (error) {
    console.error('Server error while adding review:', error);
    res.status(500).json({ message: 'Server error while adding review', error });
  }
};
