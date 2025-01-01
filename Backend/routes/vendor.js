import express from 'express';
import Product from '../models/product.js';
import Vendor from '../models/vendor.js';
import { productSchema } from '../utils/zodSchemas.js';
import { productImageUpload } from '../utils/multer.js';
import { safeHandler } from '../middleware/safeHandler.js';

const router = express.Router();

// Add a new product
router.post('/addproduct', productImageUpload, safeHandler( async (req, res) => {
    
        // Parse the incoming data
        const parsedData = {
            ...req.body,
            price: parseFloat(req.body.price),
            stock: JSON.parse(req.body.stock),
            promoCode: req.body.promoCode ? JSON.parse(req.body.promoCode) : undefined
        };

        const validatedData = productSchema.parse(parsedData);
        console.log("Add product data: ");
        console.log(validatedData);

        const { name, description, price, vendorId, category, stock, promoCode } = validatedData;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Collect filenames from uploaded files
        const images = req.files.map((file) => file.filename);

        const newProduct = new Product({
            name,
            description,
            price,
            vendor: vendorId,
            image: images,
            category,
            stock,
            promoCode
        });
        const savedProduct = await newProduct.save();
        vendor.products.push(savedProduct._id);
        await vendor.save();

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

        const vendor = await Vendor.findById(deletedProduct.vendor);
        if (vendor) {
            vendor.products.pull(deletedProduct._id);
            await vendor.save();
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;