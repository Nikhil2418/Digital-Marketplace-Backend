const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth')
const customerProfiles = require('./routes/customerProfiles');
const applicationRoutes = require('./routes/applicationRoutes');
const serviceProviderProfileRoutes = require('./routes/serviceProviderProfileRoutes');
const customerRoutes = require('./routes/customerRoutes');
const reviewRoutes = require('./routes/reviewRoutes')

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Body parser

// Routes
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/services', require('./routes/serviceRoutes'))
app.use('/api/customer-profiles', customerProfiles);
app.use('/api', applicationRoutes);
app.use('/api', serviceProviderProfileRoutes);
app.use('/api', customerRoutes);
app.use('/api/reviews', reviewRoutes);

// add hello route
app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
