import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true,
        trim: true // Name of the vendor's business
    },
    businessAddress: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true }
    },
    contactDetails: {
        phoneNumber: { type: String, required: true, trim: true }, 
        email: { type: String, required: true, trim: true } 
    },
    walletBalance: {
        type: Number,
        default: 0.0 // Tracks the vendor's earnings
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
            ref: 'Product' // Products sold by the vendor
        }
    ],
    ratings: {
        averageRating: { type: Number, default: 0.0 }, // Average rating of the vendor
        numberOfReviews: { type: Number, default: 0 } // Number of reviews received
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
