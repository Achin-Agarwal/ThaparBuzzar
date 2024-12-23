import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
            type: String,
            required: true
    },
    email: {
        address: {
            type: String,
            required: true,
            unique: true
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    auth0Ids: [
        {
            type: String,
            required: true,
            unique: true
        }
    ],
    picture: {
        type: String
    },

    // mobileNumber: {
    //     isVerified: {
    //         type: Boolean,
    //         default: false
    //     },
    //     number: {
    //         type: String,
    //         required: true,
    //         unique: true
    //     }// no mobile for now
    // },
    birthday: {
        type: Date
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
        houseNumber: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        landmark: {
            type: String
        },
        pincode: {
            type: String,
            required: true
        }

    },
    isVendor: {
        type: Boolean,
        default: false // Flag to indicate if the user is also a vendor
    },
    vendorDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor', // Reference to the Vendor model
        required: function () { return this.isVendor; } // Only required if isVendor is true
    },
  
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
});

const User = mongoose.model('User', userSchema);

export default User;


// {
//     "email": "devanshvashishat@gmail.com",
//     "auth0Ids": ["auth0|6769b3cec7df053fed424e3d", "google-oauth2|110028290344043295343"],
//     "name": "Devansh Vashishat",
//     "picture": "https://lh3.googleusercontent.com/a/...",
//     "isVendor": false
//   }