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

const router = express.Router();

router.post("/", isLogin, safeHandler(async (req, res) => {
    const { cart, quantity, productId } = req.body;



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


        if (product.stock < quantity) {
            return res.status(400).json({ message: "Product out of stock" });
        }

        // check if discount is even applicable on prodect
        if (product.discount > 0 && product.numberOfUses > 0) {
            // if discount is applied on partial quantity
            if (product.numberOfUses < quantity) {

            }
            //if discount is applied on all of quantity
            if (product.numberOfUses > quantity) {
                totalPrice = product.price * quantity 
                product.numberOfUses -= quantity;
            }
        }



    }
    if (req.user.role !== "buyer") {
        return res.status(401).json({ message: "Unauthorized access" });
    }



}));


export default router;