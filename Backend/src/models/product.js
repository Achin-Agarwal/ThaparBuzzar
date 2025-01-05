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
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    image: [
        {
            type: String
        }
    ],
    category: {
        type: String,
        enum: [
            'Electronics',
            'Fashion',
            'Collectibles and art',
            'Beauty',
            'Services',
            'Other'
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
    promoCode: {
        code: {
            type: String
        },
        numberOfUses: {
            type: Number
        },
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
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
            ref: 'User'
        }
    ]
},
    { timestamps: true }
);
const Product = mongoose.model('Product', productSchema);
export default Product;