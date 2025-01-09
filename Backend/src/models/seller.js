import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
    email: {
        address: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    sellerName: {
        type: String,
        required: false,
        trim: true
    },
    password: {
        type: String,
        required: false,
        trim: true
    },
    businessName: {
        type: String,
        required: false,
        trim: true 
    },
    businessAddress: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true }
    },
    contactDetails: {
        phoneNumber: { type: String, required: false, trim: true }, 
        email: { type: String, required: false, trim: true } 
    },
    walletBalance: {
        type: Number,
        default: 0.0 // Tracks the seller's earnings
    },
    paymentPreferences: {
        bankName: { type: String, trim: true },
        accountNumber: { type: String, trim: true },
        IFSCCode: { type: String, trim: true },
        UPIId: { type: String, trim: true }
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' // Products sold by the seller
        }
    ],
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service' // Services offered by the seller
        }
    ],
    ratings: {
        averageRating: { type: Number, default: 0.0 }, // Average rating of the seller
        numberOfReviews: { type: Number, default: 0 } // Number of reviews received
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
