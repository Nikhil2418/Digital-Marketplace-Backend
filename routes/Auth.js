const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {authenticateToken} = require('../middlewares/auth');
const CustomerProfile = require('../models/CustomerProfile');
const ServiceProviderProfile = require('../models/ServiceProviderProfile');

const router = express.Router();

// Utility function to generate JWT
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// @route POST /auth/register
// @desc Register new user (Customer or Service Provider)
// @access Public
router.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create a new user
    user = new User({
      name,
      email,
      password,
      role: userType,
    });

    await user.save();

    if(userType === 'customer'){
      const newCustomer = new CustomerProfile({
        userId: user._id,
        name: user.name,
        email: user.email,
      });
      await newCustomer.save();
    }

    if(userType === 'service-provider'){
      const newServiceProvider = new ServiceProviderProfile({
        userId: user._id,
        name: user.name,
        email: user.email,
      });
      await newServiceProvider.save()
    }

    // Generate JWT and respond with token
    const token = generateToken(user._id, user.role);
    res.status(201).json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route POST /auth/login
// @desc Login user
// @access Public
router.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;
  console.log(email, password)
  try {
    const user = await User.findOne({ email, role:userType });
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, userType: user.role, name: user.name }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ token, user: {id: user._id, userType: user.role, name: user.name} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/logout', authenticateToken, (req, res) => {
  // For JWT, you typically don't need to invalidate the token.
  // However, if you're managing refresh tokens or session tokens,
  // you can handle invalidation logic here.

  // Optionally, you can send a response to indicate logout success.
  res.status(200).json({ message: 'Logout successful' });
});


module.exports = router;
