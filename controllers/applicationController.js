const Application = require('../models/Application');
const Service = require('../models/Service');
const User = require('../models/User');
const ServiceProviderProfile = require('../models/ServiceProviderProfile');
const CustomerProfile = require('../models/CustomerProfile');

// Create a new application
exports.createApplication = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const applicantId = req.user.id;

    // Find the service and its provider
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Create a new application
    const newApplication = new Application({
      applicantId,
      serviceId,
      serviceProviderId: service.provider, // Use service's provider ID
    });

    // Save the application
    const savedApplication = await newApplication.save();

    // Notify the service provider (simplified example - you can implement more complex notification logic)
    const provider = await User.findById(service.provider);
    console.log(`Notification: ${provider.name}, someone applied for your service: ${service.title}`);

    res.status(201).json(savedApplication);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Server error while creating application', error });
  }
};

// Get all applications (for testing purposes)
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('applicantId serviceId serviceProviderId');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving applications', error });
  }
};


exports.getProviderApplications = async (req, res) => {
    try {
      const providerId = req.user.id; // Get the logged-in provider's ID
      const applications = await Application.find({ serviceProviderId: providerId })
        .populate('serviceId', 'title description') // Include service details
        .populate('applicantId', 'name email'); // Include applicant details
  
      if (!applications) {
        return res.status(404).json({ message: 'No applications found for this provider.' });
      }
  
      res.json(applications);
    } catch (error) {
      console.error('Error retrieving applications for provider:', error);
      res.status(500).json({ message: 'Server error while retrieving applications.', error });
    }
  };

  // Get all applications for a specific user
exports.getUserApplications = async (req, res) => {
    try {
      const userId = req.params.userId;
      const applications = await Application.find({ applicantId: userId })
        .populate('serviceId', 'title description')
        .populate('serviceProviderId', 'name email');
      
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user applications', error });
    }
  };

// Delete an application by ID
exports.deleteApplication = async (req, res) => {
    try {
      const { applicationId } = req.params;
      const application = await Application.findById(applicationId);
  
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
  
      // Check if the logged-in user is either the applicant or the service provider
      if (application.applicantId.toString() !== req.user.id && application.serviceProviderId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to delete this application' });
      }
  
      await Application.findByIdAndDelete(applicationId);
      res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
      res.status(500).json({ message: 'Error deleting application', error });
    }
  };


  exports.updateApplicationStatus = async (req, res) => {
    try {
      const { status } = req.body; // Extract status from request body
      const applicationId = req.params.applicationId; // Extract application ID from request parameters
  
      // Find the application by ID
      const application = await Application.findById(applicationId);
  
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
  
      // Optional: Add authorization check if needed, e.g., only the applicant or service provider can update
  
      // Update the status
      application.status = status;
      await application.save();
  
      res.json({ message: 'Application status updated successfully', application });
    } catch (error) {
        console.error('Error updating application status:', error);
      res.status(500).json({ message: 'Error updating application status', error });
    }
  };

  // Update application payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
      const { paymentStatus } = req.body; // Extract payment status from the request body
      const applicationId = req.params.applicationId; // Get application ID from request parameters
  
      // Find the application by ID
      const application = await Application.findById(applicationId);
  
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
  
      // Check if the logged-in user is the service provider of this application
      if (application.serviceProviderId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update payment status for this application' });
      }
  
      // Update the payment status
      application.paymentStatus = paymentStatus;
      await application.save();

    //   update the Service status to Payment Received
        const service = await Application.findById(applicationId);
        service.status = 'Payment Received';
        await service.save();
  
      res.json({ message: 'Payment status updated successfully', application });
    } catch (error) {
        console.error('Error updating payment status:', error);
      res.status(500).json({ message: 'Error updating payment status', error });
    }
  };

  exports.addReview = async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { reviewText, rating } = req.body;
  
      // Populate only the fields defined in your schema
      const application = await Application.findById(applicationId)
        .populate('applicantId') // Replace with your defined fields
        .populate('serviceProviderId');
  
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
  
      // Check if the logged-in user is either the service provider or the applicant
      if (
        req.user.id !== application.serviceProviderId.toString() &&
        req.user.id !== application.applicantId.toString()
      ) {
        return res.status(403).json({ message: 'You are not authorized to add a review for this application.' });
      }
  
      const newReview = {
        reviewedBy: req.user.id,
        reviewText,
        rating,
      };
  
      // Add the review to the application
      application.reviews.push(newReview);
      await application.save();
  
      // Update the Service Provider Profile if the review is given by a customer
      if (req.user.id === application.applicantId.toString()) {
        await updateProfileReview(ServiceProviderProfile, application.serviceProviderId, newReview);
      }
  
      // Update the Customer Profile if the review is given by a service provider
      if (req.user.id === application.serviceProviderId.toString()) {
        await updateProfileReview(CustomerProfile, application.applicantId, newReview);
      }
  
      res.json({ message: 'Review added successfully', reviews: application.reviews });
    } catch (error) {
        console.error('Server error while adding review:', error);
      res.status(500).json({ message: 'Server error while adding review', error });
    }
  };
  
  // Helper function to update profiles
  async function updateProfileReview(ProfileModel, profileId, review) {
    const profile = await ProfileModel.findOne({ userId: profileId });
    if (!profile) {
      throw new Error('Profile not found');
    }
  
    // Calculate new average rating
    const newTotalRatings = profile.ratingsCount + 1;
    const newAverageRating = (profile.averageRating * profile.ratingsCount + review.rating) / newTotalRatings;
  
    // Update profile details
    profile.reviews.push(review);
    profile.averageRating = newAverageRating;
    profile.ratingsCount = newTotalRatings;
  
    await profile.save();
  }
  