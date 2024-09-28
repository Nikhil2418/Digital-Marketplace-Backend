// Assuming you are using Express
const express = require('express');
const router = express.Router();

// Mock data for customers and services (You will replace this with actual DB queries)
const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', location: 'Mumbai' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com', location: 'Delhi' }
];

const services = [
  { id: 1, title: 'Web Development', description: 'Build a modern website', price: 15000 },
  { id: 2, title: 'Graphic Design', description: 'Create stunning visuals', price: 8000 }
];

// API to fetch customers
router.get('/customers', (req, res) => {
  res.json(customers);
});

// API to fetch services
router.get('/services', (req, res) => {
  res.json(services);
});

module.exports = router;
