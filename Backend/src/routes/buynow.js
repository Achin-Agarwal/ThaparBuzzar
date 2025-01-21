import express from "express";
import mongoose from "mongoose";
// middleware import
import isLogin from "../middleware/isLogin.js";
import { safeHandler } from '../middleware/safeHandler.js';
//models import 
import Buyer from "../models/buyer.js";
import Product from '../models/product.js';
import Seller from '../models/seller.js';
import Order from '../models/order.js';

const router = express.Router();

router.post("/", isLogin, safeHandler(async (req, res) => {
    const { cart, quantity, productId } = req.body;
    const buyer = await Buyer.findById(req.user.id);

    if (req.user.role !== "buyer") {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    // Handle order from the cart
    if (cart && Array.isArray(cart) && cart.length > 0) {
        let totalPrice = 0;
        const orderProducts = [];
        if(cart){
            cart = buyer.cart
        }

        for (const item of cart) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product} not found` });
            }

            if (product.stock.available < item.quantity) {
                return res.status(400).json({ message: `Product ${product.name} is out of stock for the requested quantity` });
            }

            // Calculate price based on discount availability
            if (product.discount > 0 && product.numberOfUses > 0) {
                const discountedQuantity = Math.min(item.quantity, product.numberOfUses);
                const remainingQuantity = item.quantity - discountedQuantity;

                totalPrice +=
                    product.discountedPrice * discountedQuantity +
                    product.price * remainingQuantity;

                product.numberOfUses = Math.max(0, product.numberOfUses - discountedQuantity);
            } else {
                totalPrice += product.price * item.quantity;
            }

            // Update product stock and sales
            product.stock.available -= item.quantity;
            product.stock.sold += item.quantity;
            product.stock.soldAt.push(new Date());

            await product.save();

            orderProducts.push({
                product: item.product,
                quantity: item.quantity,
            });
        }

        // Create a consolidated order
        const order = new Order({
            buyer: req.user.id,
            products: orderProducts,
            status: 'placed',
            totalPrice,
        });

        await order.save();

        // Add order reference to buyer
        buyer.orders.push(order._id);
        await buyer.save();

        return res.status(201).json({ message: "Order placed successfully from cart", order });
    }

    // Handle order from product page
    if (quantity && productId) {
        let totalPrice = 0;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock.available < quantity) {
            return res.status(400).json({ message: "Product out of stock" });
        }

        // Calculate price based on discount availability
        if (product.discount > 0 && product.numberOfUses > 0) {
            const discountedQuantity = Math.min(quantity, product.numberOfUses);
            const remainingQuantity = quantity - discountedQuantity;

            totalPrice +=
                product.discountedPrice * discountedQuantity +
                product.price * remainingQuantity;

            product.numberOfUses = Math.max(0, product.numberOfUses - discountedQuantity);
        } else {
            totalPrice = product.price * quantity;
        }

        // Update product stock and sales
        product.stock.available -= quantity;
        product.stock.sold += quantity;
        product.stock.soldAt.push(new Date());

        await product.save();

        const order = new Order({
            buyer: req.user.id,
            products: [
                {
                    product: productId,
                    quantity,
                },
            ],
            status: 'placed',
            totalPrice,
        });

        await order.save();

        return res.status(201).json({ message: "Order placed successfully from product page", order });
    }

    return res.status(400).json({ message: "Invalid request" });
}));


export default router;