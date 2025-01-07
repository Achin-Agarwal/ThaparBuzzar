import express from 'express';
import Product from '../models/product.js';
import Seller from '../models/seller.js';
import { productSchema } from '../utils/zodSchemas.js';
import { productImageUpload } from '../utils/multer.js';
import { safeHandler } from '../middleware/safeHandler.js';
import responseHandler from '../middleware/responseHandler.js';
import isLogin from '../middleware/isLogin.js';
const router = express.Router();

// Add a new product
router.post('/addproduct', isLogin, productImageUpload, safeHandler( async (req, res) => {
        req.user.role==='buyer'?null:res.status(401).json({message:"Unauthorized access"});
        // Parse the incoming data
        const parsedData = {
            ...req.body,
            price: parseFloat(req.body.price),
            stock: JSON.parse(req.body.stock),
            promoCode: req.body.promoCode ? JSON.parse(req.body.promoCode) : undefined
        };
        console.log("body: ");
        console.log(req.body);
        console.log("parsed data: ");
        console.log(parsedData);
        const validatedData = productSchema.parse(parsedData);
        console.log("validated data: ");
        console.log(validatedData);

        const { name, description, price, category, stock, promoCode } = validatedData;
        const sellerId = req.body.sellerId;
        console.log("Seller ID: "); console.log(sellerId);
        if (!sellerId) { console.log(sellerId);
            return res.error(400, 'Seller ID is required', 'MISSING_VENDOR_ID');
        }
        const seller = await Seller.findById(sellerId);

        // Collect filenames from uploaded files
        const images = req.files.map((file) => file.filename);

        const newProduct = new Product({
            name,
            description,
            price,
            seller: sellerId,
            image: images,
            category,
            stock,
            promoCode
        });
        const savedProduct = await newProduct.save();
        seller.products.push(savedProduct._id);
        await seller.save();

        res.status(201).json(savedProduct);
 
}));



// Delete a product
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const seller = await Seller.findById(deletedProduct.seller);
        if (seller) {
            seller.products.pull(deletedProduct._id);
            await seller.save();
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// router.

export default router;