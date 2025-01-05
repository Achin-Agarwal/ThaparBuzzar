import express from "express";
import { safeHandler } from "../middleware/safeHandler.js";
import Product from "../models/product.js";
import Seller from "../models/seller.js";


const router = express.Router();

router.get("/bestsellers", safeHandler(async (req, res) => {
    const categories = await Product.distinct("category");
    const bestsellers = await Promise.all(categories.map(async (category) => {
        return  await Product.findOne({ category }).sort({ "stock.sold": -1 }).exec();
    }));
    return res.json(bestsellers);
}));
router.get("/products", safeHandler(async (req, res) => {
    const products = await Product.find().exec();
   return res.json(products);
}));

export default router;
