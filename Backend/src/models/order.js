import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    products: [
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
    status: {
        type: String,
        enum: ['placed', 'shipped', 'delivered', 'cancelled'],
        default: 'placed'
    }, 
});

const Order = mongoose.model('Order', orderSchema);

export default Order;