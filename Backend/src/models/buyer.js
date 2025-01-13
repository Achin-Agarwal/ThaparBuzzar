
import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
    name: {
            type: String,
            required: true
    },
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
    picture: {
        type: String
    },
    password: {
        type: String,
        required: false,
        trim: true,
        default: "account createdby google"
    },
    // birthday: {
    //     type: Date
    // },
    phoneNumber: {
        type: String,
        required: false
    },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    address: {
        roomNumber: {
            type: String,
            required: false,
            default: "Not Provided"
        },
       floor: {
            type: String,
            required: false,
            default: "Not Provided"
        },
        city: {
            type: String,
            required: false,
            default: "Not Provided"
        },
        hostel: {
            type: String,
            required: false,
            default: "Not Provided"
        },

    },
});

const Buyer = mongoose.model('buyer', buyerSchema);

export default Buyer;


// {
//     "email": "devanshvashishat@gmail.com",
//     "auth0Ids": ["auth0|6769b3cec7df053fed424e3d", "google-oauth2|110028290344043295343"],
//     "name": "Devansh Vashishat",
//     "picture": "https://lh3.googlebuyercontent.com/a/...",
//     "isSeller": false
//   }