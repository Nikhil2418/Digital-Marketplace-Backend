const Service = require('../models/Service'); // Mongoose Service model
const Application = require('../models/Application'); // Mongoose Application model

// Create a new service
const createService = async (req, res) => {
    try {
      const { title, description, skills, budget, country, duration, timeCommitment } = req.body;
  
      // Create a new service document with the additional fields
      const service = new Service({
        title,
        description,
        skills, // Array of skills
        budget, // Replace "price" with "budget" from the request
        country,
        duration,
        timeCommitment,
        provider: req.user.id, // Set the service provider's ID from the authenticated user
      });
  
      const savedService = await service.save();
      res.status(201).json(savedService);
    } catch (error) {
      res.status(500).json({ message: 'Server error while creating service', error });
    }
  };

// Get all services (for both customers and service providers)
const getAllServices = async (req, res) => {
    try {
      const userId = req.user.id; // Get the current logged-in user's ID
  
      // Fetch all services
      const services = await Service.find();
  
      // Fetch all applications by the current user
      const applications = await Application.find({ applicantId: userId });
  
      // Create a set of service IDs that the user has already applied for
      const appliedServiceIds = new Set(applications.map((application) => application.serviceId.toString()));
  
      // Filter services to exclude the ones the user has applied for
      const availableServices = services.filter((service) => !appliedServiceIds.has(service._id.toString()));
  
      res.json(availableServices);
    } catch (error) {
      res.status(500).json({ message: 'Server error while fetching services', error });
    }
  };

// Get a single service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching the service', error });
  }
};

// Update a service (only service provider)
const updateService = async (req, res) => {
    try {
      const { title, description, skills, budget, country, duration, timeCommitment, level } = req.body;
      const service = await Service.findById(req.params.id);
  
      // Check if the service exists
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      // Check if the logged-in user is the service provider
      if (service.provider.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this service' });
      }
  
      // Update service fields if new values are provided
      service.title = title || service.title;
      service.description = description || service.description;
      service.skills = skills || service.skills;
      service.budget = budget || service.budget;
      service.country = country || service.country;
      service.duration = duration || service.duration;
      service.timeCommitment = timeCommitment || service.timeCommitment;
      service.level = level || service.level;
  
      // Save the updated service
      const updatedService = await service.save();
  
      res.json(updatedService);
    } catch (error) {
      console.error('Server error while updating the service:', error);
      res.status(500).json({ message: 'Server error while updating the service', error });
    }
  };
  
  module.exports = updateService;
  
// Delete a service (only service provider)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this service' });
    }

    await service.remove();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting the service', error });
  }
};

// Update service status (Customer Side)
const updateServiceStatus = async (req, res) => {
    try {
      const { serviceId, status } = req.body;
      const service = await Service.findById(serviceId);
  
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      // Check if the logged-in user is the customer of this service
      if (service.customer.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this service' });
      }
  
      // Update the status
      service.status = status;
      await service.save();
  
      res.json({ message: 'Service status updated successfully', service });
    } catch (error) {
      res.status(500).json({ message: 'Error updating service status', error });
    }
  };
  
  // Mark service as paid (Provider Side)
  const markAsPaid = async (req, res) => {
    try {
      const { serviceId } = req.body;
      const service = await Service.findById(serviceId);
  
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      // Check if the logged-in user is the provider of this service
      if (service.provider.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to mark this service as paid' });
      }
  
      // Update the status to 'Paid'
      service.status = 'Paid';
      await service.save();
  
      res.json({ message: 'Service marked as paid successfully', service });
    } catch (error) {
      res.status(500).json({ message: 'Error marking service as paid', error });
    }
  };

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
    updateServiceStatus,
    markAsPaid
};
