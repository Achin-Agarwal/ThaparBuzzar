import express from "express";
import mongoose from "mongoose";
import Buyer from "../models/buyer.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.post("/addtocart/:id/:quantity", isLogin, async (req, res) => {
    console.log("/addtocart");
    
        const { id, quantity } = req.params;
        const buyerId = req.user._id;
console.log("id");
console.log(id);
console.log("quantity");
console.log(quantity);
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
        await buyer.populate('cart.product');
        await buyer.save();

        res.status(200).json({ message: "Cart updated successfully", cart: buyer.cart });
   
});

router.post("/deleatecartitem/:id/:quantity", isLogin, async (req, res) => {
    console.log("/deleatecartitem");
    const { id, quantity } = req.params;
    console.log("id");
    console.log(id);
    console.log("quantity");
    console.log(quantity);
    const buyerId = req.user._id;
        // Find the buyer by ID
        const buyer = await Buyer.findById(buyerId);

        if (!buyer) {
            return res.status(404).json({ error: "Buyer not found" });
        }

        // Check if the product exists in the cart
        const cartItemIndex = buyer.cart.findIndex((item) => item.product.toString() === id);

        if (cartItemIndex === -1) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        const currentQuantity = buyer.cart[cartItemIndex].quantity;

        if (currentQuantity <= parseInt(quantity)) {
            // Remove the item from the cart if quantity is less than or equal to what's being removed
            buyer.cart.splice(cartItemIndex, 1);
        } else {
            // Reduce the quantity of the item
            buyer.cart[cartItemIndex].quantity -= parseInt(quantity);
        }
        await buyer.populate('cart.product');
        await buyer.save();

        res.status(200).json({ message: "Cart item updated successfully", cart: buyer.cart });
    
});
router.get("/usercart", isLogin, async (req, res) => {
    const buyerId = req.user._id;

    // Find the buyer by ID and populate the cart
    const buyer = await Buyer.findById(buyerId).populate('cart.product');

    if (!buyer) {
        return res.status(404).json({ error: "Buyer not found" });
    }

    res.status(200).json({ cart: buyer.cart });
});

export default router;