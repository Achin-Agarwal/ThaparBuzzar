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
    const products = await Product.find().populate('seller').exec();
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
    const randomProducts = await Product.aggregate([
        { $sample: { size: 100 } }, 
        { $group: { _id: "$category", products: { $push: { _id: "$_id", name: "$name", image: "$image" } } } },
        { $project: { category: "$_id", products: { $slice: ["$products", 4] }, _id: 0 } }
    ]);
    
    const formattedResponse = randomProducts.reduce((acc, item) => {
        acc[item.category] = item.products;
        return acc;
    }, {});
console.log("formattedResponse");
console.log(formattedResponse);
console.log("randomProducts")
console.log(randomProducts)
    return res.json(formattedResponse);
}));

export default router;
