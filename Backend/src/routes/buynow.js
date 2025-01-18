import express from "express";
import mongoose from "mongoose";
// middleware import
import isLogin from "../middleware/isLogin.js";
import { safeHandler } from '../middleware/safeHandler.js';
//models import 
import Buyer from "../models/buyer.js";
import Product from '../models/product.js';
import Service from '../models/services.js';
import Seller from '../models/seller.js';
import Order from '../models/order.js';

const router = express.Router();

router.post("/", isLogin, safeHandler(async (req, res) => {
    const { cart, quantity, productId } = req.body;
    const buyer = await Buyer.findById(req.user.id);


    if (req.user.role !== "buyer") {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    //check if order to be olaced from cart
    if (cart) {

    }
    //check if order to be placed from product page
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
    if (req.user.role !== "buyer") {
        return res.status(401).json({ message: "Unauthorized access" });
    }



}));


export default router;