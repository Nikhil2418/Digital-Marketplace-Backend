const Service = require('../models/Service');

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const service = new Service({
      title,
      description,
      category,
      price,
      provider: req.user._id, // Assuming you have user authentication
    });

    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all services for a service provider
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific service
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Ensure the logged-in user is the owner of the service
    if (service.provider.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    service.title = title;
    service.description = description;
    service.category = category;
    service.price = price;

    await service.save();
    res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Publish a service
exports.publishService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Ensure the logged-in user is the owner of the service
    if (service.provider.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    service.isPublished = true;
    await service.save();
    res.status(200).json({ message: 'Service published successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
