const CustomerProfile = require('../models/CustomerProfile');
const User = require('../models/User');

// Create a new Customer Profile
exports.createCustomerProfile = async (req, res) => {
  try {
    const profileData = {
      ...req.body,
      userId: req.user.id, // Set the userId from the authenticated user
    };

    const newProfile = new CustomerProfile(profileData);
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer profile', error });
  }
};

// Get a Customer Profile by ID
exports.getCustomerProfile = async (req, res) => {
    try {
      // First, find the user by the provided ID (or email)
      const user = await User.findById(req.params.id); // Or use other search criteria
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('user', user);
      // Next, find the corresponding CustomerProfile using the userId
      const profile = await CustomerProfile.findOne({ userId: user._id }).populate('userId', 'name email');
      console.log('profile', profile);
      // Check if the profile exists
      if (!profile) {
        return res.status(404).json({ message: 'Customer Profile not found' });
      }
  
      // Respond with the profile and populated user details
      res.json(profile);
    } catch (error) {
      console.error('Error retrieving customer profile:', error);
      res.status(500).json({ message: 'Error retrieving customer profile', error });
    }
  };

// Update a Customer Profile by ID
exports.updateCustomerProfile = async (req, res) => {
    try {
      // Find the user by ID or other search criteria
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the customer profile using the user ID
      const profile = await CustomerProfile.findOne({ userId: user._id });
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      // Check if the logged-in user is the owner of the profile
      if (profile.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this profile' });
      }
  
      // Update fields based on the request body
      Object.keys(req.body).forEach((key) => {
        if (Array.isArray(req.body[key])) {
          // Handle arrays (e.g., skills, languages)
          profile[key] = [...req.body[key]];
        } else if (typeof req.body[key] === 'object' && req.body[key] !== null) {
          // Handle nested objects like education or linkedAccounts
          profile[key] = { ...profile[key], ...req.body[key] };
        } else {
          // Handle regular fields (e.g., summary, location)
          profile[key] = req.body[key];
        }
      });
  
      // Save the updated profile
      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: 'Error updating customer profile', error });
    }
  };
  

// Delete a Customer Profile by ID
exports.deleteCustomerProfile = async (req, res) => {
  try {
    const profile = await CustomerProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check if the logged-in user is the owner of the profile
    if (profile.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this profile' });
    }

    await profile.remove();
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer profile', error });
  }
};

