import express from 'express';
import Product from '../models/product.js';
import Vendor from '../models/vendor.js';
import { productSchema } from '../utils/zodSchemas.js';
import { productImageUpload } from '../utils/multer.js';
import { safeHandler } from '../middleware/safeHandler.js';
import responseHandler from '../middleware/responseHandler.js';
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
        console.log("body: ");
        console.log(req.body);
        console.log("parsed data: ");
        console.log(parsedData);
        const validatedData = productSchema.parse(parsedData);
        console.log("validated data: ");
        console.log(validatedData);

        const { name, description, price, category, stock, promoCode } = validatedData;
        const vendorId = req.body.vendorId;
        console.log("Vendor ID: "); console.log(vendorId);
        if (!vendorId) { console.log(vendorId);
            return res.error(400, 'Vendor ID is required', 'MISSING_VENDOR_ID');
        }
        const vendor = await Vendor.findById(vendorId);

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