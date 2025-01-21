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

        if (cart) {
            cart = buyer.cart
        }

        for (const item of cart) {
            console.log("This is the cut=rrent that is being worked upon");                               //  to be removed in production
            console.log(item);                                                                           //  to be removed in production
            console.log("*************************************************************");               //  to be removed in production
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

                                                                                                          //Handel oreder from single product or product 
    if (quantity && productId) {
        let totalPrice = 0;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }


        if (product.stock.available < quantity) {
            return res.status(400).json({ message: "Product out of stock" });
        }

        // check if discount is even applicable on prodect
        if (product.discount > 0 && product.numberOfUses > 0) {
            // if discount is applied on partial quantity
            if (product.numberOfUses < quantity) {
                let discountedQuantity = product.numberOfUses;
                let remainingQuantity = quantity - discountedQuantity;
                totalPrice = product.discountedPrice * discountedQuantity + product.price * remainingQuantity;
                product.stock.available -= quantity;
                product.numberOfUses = 0;
                product.stock.sold += quantity;
                product.stock.soldAt.push(new Date());
                const order = new Order({
                    buyer: req.user.id,
                    products: [
                        {
                            product: productId,
                            quantity: quantity
                        }
                    ],
                    status: 'placed'
                });

                await order.save();

                product.orders.push(order._id);
                product.boughtBy.push(req.user.id);

                await product.save();

                res.status(201).json({ message: "Order placed successfully", order });

            }
            //if discount is applied on all of quantity
            if (product.numberOfUses > quantity) {
                totalPrice = product.price * quantity
                product.numberOfUses -= quantity;
                product.stock.available -= quantity;
                product.stock.available -= quantity;
                product.numberOfUses = 0;
                product.stock.sold += quantity;
                product.stock.soldAt.push(new Date());
                const order = new Order({
                    buyer: req.user.id,
                    products: [
                        {
                            product: productId,
                            quantity: quantity
                        }
                    ],
                    status: 'placed'
                });

                await order.save();

                product.orders.push(order._id);
                product.boughtBy.push(req.user.id);

                await product.save();

                res.status(201).json({ message: "Order placed successfully", order });

            }
        }
        //----------------add order model---------------------
        totalPrice = product.price * quantity;
        product.stock.available -= quantity;
        product.numberOfUses -= quantity;
        product.stock.sold += quantity;
        product.stock.soldAt.push(new Date());
        console.log(totalPrice);
        console.log(product);
        product.save();
        const order = new Order({
            buyer: req.user.id,
            products: [
                {
                    product: productId,
                    quantity: quantity
                }
            ],
            status: 'placed'
        });

        await order.save();

        product.orders.push(order._id);
        product.boughtBy.push(req.user.id);

        await product.save();

        res.status(201).json({ message: "Order placed successfully", order });
    }
}
));
export default router;



// flow of the code to buy product

// order is placed 
// check if product is in stock
// check if discount is applicable
// check if discount is applicable on all quantity
// check if discount is applicable on partial quantity
// calculate total price
// update product stock