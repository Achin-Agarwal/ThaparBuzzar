import mongoose from 'mongoose';
import Buyer from './src/models/buyer.js';
import dotenv from 'dotenv';
import Seller from './src/models/seller.js';

dotenv.config();

const buyers = [
    {
        name: 'John Doe',
        email: { address: 'john.doe@example.com', isVerified: true },
        picture: 'https://example.com/john.jpg',
        password: 'password123',
        auth0Ids: ['auth0|1234567890'],
        birthday: new Date('1990-01-01'),
        address: {
            houseNumber: '123',
            street: 'Main St',
            city: 'Anytown',
            state: 'Anystate',
            landmark: 'Near Park',
            pincode: '123456'
        }
    },
    {
        name: 'Jane Smith',
        email: { address: 'jane.smith@example.com', isVerified: true },
        picture: 'https://example.com/jane.jpg',
        password: 'password123',
        auth0Ids: ['auth0|0987654321'],
        birthday: new Date('1985-05-15'),
        address: {
            houseNumber: '456',
            street: 'Second St',
            city: 'Othertown',
            state: 'Otherstate',
            landmark: 'Near Mall',
            pincode: '654321'
        }
    }
];

async function addBuyers() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        await Buyer.insertMany(buyers);
        console.log('Buyers added successfully');
    } catch (error) {
        console.error('Error adding buyers:', error);
    } finally {
        mongoose.connection.close();
    }
}

// addBuyers();
const sellers = [
    {
        email: { address: 'seller1@example.com', isVerified: true },
        password: 'password123',
        businessName: 'Seller One Business',
        businessAddress: {
            street: '123 Business St',
            city: 'Business City',
            state: 'Business State',
            zipCode: '12345'
        },
        contactDetails: {
            phoneNumber: '123-456-7890',
            email: 'contact@seller1business.com'
        },
        walletBalance: 1000.0,
        paymentPreferences: {
            bankName: 'Bank One',
            accountNumber: '1234567890',
            IFSCCode: 'IFSC0001',
            UPIId: 'seller1@upi'
        }
    },
    {
        email: { address: 'seller2@example.com', isVerified: true },
        password: 'password123',
        businessName: 'Seller Two Business',
        businessAddress: {
            street: '456 Business Ave',
            city: 'Commerce City',
            state: 'Commerce State',
            zipCode: '67890'
        },
        contactDetails: {
            phoneNumber: '098-765-4321',
            email: 'contact@seller2business.com'
        },
        walletBalance: 2000.0,
        paymentPreferences: {
            bankName: 'Bank Two',
            accountNumber: '0987654321',
            IFSCCode: 'IFSC0002',
            UPIId: 'seller2@upi'
        }
    }
];

async function addSellers() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        await Seller.insertMany(sellers);
        console.log('Sellers added successfully');
    } catch (error) {
        console.error('Error adding sellers:', error);
    } finally {
        mongoose.connection.close();
    }
}

addSellers();