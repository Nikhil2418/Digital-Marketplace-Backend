const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    
    console.log('user', user);
    req.user = user; // Attach user details to the request object
    next();
  });
};

// Role-based Authorization Middleware for Service Provider
const isServiceProvider = (req, res, next) => {
  if (req.user.userType !== 'service-provider') {
    return res.status(403).json({ message: 'Unauthorized: Only service providers can access this route' });
  }
  next();
};

module.exports = { authenticateToken, isServiceProvider };
