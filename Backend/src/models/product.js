import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    },
    image: [
        {
            type: String
        }
    ],
    category: {
        type: String,
        enum: [
            "Beauty",
            "Food",
            "Fashion",
            "Decor",
            "Health",
            "Services",
            "Others"
        ]
    },
    stock: {
        available: {
            type: Number,
            required: true
        },
        sold: {
            type: Number,
            default: 0
        },
        soldAt: [{
            type: Date
        }]
    },
    discountedPrice: {  
        type: Number
    },
    numberOfUses: {
        type: Number
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            buyer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Buyer'
            },
            review: {
                type: String
            },
            rating: {
                type: Number
            }
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    boughtBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Buyer'
        }
    ]
},
    { timestamps: true }
);
const Product = mongoose.model('Product', productSchema);
export default Product;