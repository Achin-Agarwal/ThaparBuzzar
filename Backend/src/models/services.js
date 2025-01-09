import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({ 
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: true, 
        trim: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Seller" 
    },
    image: { 
        type: [String], 
        required: true 
    },