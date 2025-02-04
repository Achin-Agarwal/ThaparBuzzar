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

// router.get("/products/:category", safeHandler(async (req, res) => {
//     const { category } = req.params;
//     const products = await Product.find({ category }).exec();
//     return res.json(products);
// }));

router.get("/products", safeHandler(async (req, res) => {
    const products = await Product.find().exec();
   return res.json(products);
}));

router.get("/discountedproducts",safeHandler(async (req,res)=>{
   const products= await Product.find({ discountedPrice: { $gt: 0 } }).exec();
    return res.json(products);
}));
// router.get("/displayproducts",safeHandler(async (req,res)=>{
//     const categories = await Product.distinct("category");
//     const randomProducts = await Promise.all(categories.map(async (category) => {
//         return await Product.aggregate([
//             { $match: { category } },
//             { $sample: { size: 4 } }
//         ]);
//     }));
//     return res.json(randomProducts);
//  }));   

 router.get("/displayproducts", safeHandler(async (req, res) => {
    const categories = await Product.distinct("category");
    const randomProducts = await Promise.all(categories.map(async (category) => {
        return await Product.aggregate([
            { $match: { category } },
            { $sample: { size: 4 } },
            { $project: { name: 1, category: 1, _id: 1, image: 1 } } // Keep only name & category, remove _id and other fields
        ]);
    }));
    return res.json(randomProducts.flat());
}));
export default router;
