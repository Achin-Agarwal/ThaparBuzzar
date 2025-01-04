import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    validTill: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        required: true
    }
});
const Otp = mongoose.model('Otp', otpSchema);

export default Otp;