import express from "express";
import mongoose from "mongoose";
import Buyer from "../models/buyer.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.post("/addtocart/:id/:quantity", isLogin, async (req, res) => {
    
        const { id, quantity } = req.params;
        const buyerId = req.user._id;

        // Find the buyer by ID
        const buyer = await Buyer.findById(buyerId);

        if (!buyer) {
            return res.status(404).json({ error: "Buyer not found" });
        }

        // Check if the product already exists in the cart
        const cartItemIndex = buyer.cart.findIndex((item) => item.product.toString() === id);
        console.log("cartItemIndex");
        console.log(cartItemIndex);

        if (cartItemIndex >= 0) {
            // Product exists, update the quantity
            buyer.cart[cartItemIndex].quantity += parseInt(quantity);
        } else {
            // Product does not exist, add a new object
            buyer.cart.push({
                product: id,
                quantity: parseInt(quantity)
            });
        }

        await buyer.save();

        res.status(200).json({ message: "Cart updated successfully", cart: buyer.cart });
   
});

router.post("/deleatecartitem", async (req, res) => {
    
});
export default router;