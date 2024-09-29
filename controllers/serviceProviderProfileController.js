const ServiceProviderProfile = require('../models/ServiceProviderProfile');
const User = require('../models/User');

// Create or update service provider profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID
    const profileFields = req.body;

    // Check if the user already has a profile
    let profile = await ServiceProviderProfile.findOne({ userId });

    if (profile) {
      // Update the profile
      profile = await ServiceProviderProfile.findOneAndUpdate(
        { userId },
        { $set: profileFields, updatedAt: Date.now() },
        { new: true }
      );
      return res.json(profile);
    }

    // Create a new profile if not found
    profile = new ServiceProviderProfile({
      ...profileFields,
      userId,
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    res.status(500).json({ message: 'Server error while creating/updating profile', error });
  }
};

// Get service provider profile by user ID
exports.getProfile = async (req, res) => {
  try {
    const profile = await ServiceProviderProfile.findOne({ userId: req.params.id }).populate('userId', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ message: 'Error retrieving profile', error });
  }
};

// Delete a service provider profile by ID
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await ServiceProviderProfile.findOneAndDelete({ userId: req.params.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Error deleting profile', error });
  }
};
