// Import necessary modules
import mongoose, { model } from 'mongoose';
import Vendor from './models/vendor.js'; // Assuming your vendor model file is named vendorModel.js

// MongoDB connection URI
const MONGO_URI = 'mongodb+srv://devansh:4OSSmo7tE0ZGDzYJ@practice.xmmkx.mongodb.net/buzzar';

// Dummy vendor data
const dummyVendor = {
    businessName: 'Achin services Pvt. Ltd.',
    businessAddress: {
        street: '345 street',
        city: 'kanpur',
        state: 'Uttar Pradesh',
        zipCode: '123456'
    },
    contactDetails: {
        phoneNumber: '1234567890',
        email: 'contact@devansh-enterprises.com'
    },
    walletBalance: 1000.0,
    paymentPreferences: {
        bankName: 'State Bank of India',
        accountNumber: '1234567890',
        IFSCCode: 'SBIN0001234',
        UPIId: 'achin@sbi'
    },
    products: [], // Add product IDs if applicable
    ratings: {
        averageRating: 4.5,
        numberOfReviews: 10
    }
};

// Connect to MongoDB and create the vendor
const createVendor = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Create the vendor
        const savedVendor = await Vendor.create(dummyVendor);
    
        console.log('Vendor created successfully:', savedVendor);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error creating vendor:', error);
        await mongoose.disconnect(); // Ensure disconnection on error
    }
};

// Run the script
createVendor();
