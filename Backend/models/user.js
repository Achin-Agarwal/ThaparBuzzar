import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },  
        lastName: {
            type: String
        }

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
    password: {
        type: String
    },
    mobileNumber: {
        isVerified: {
            type: Boolean,
            default: false
        },
        number: {
            type: String,
            required: true,
            unique: true
        }// no mobile for now
    },
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
  
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
});

const User = mongoose.model('User', userSchema);

export default User;