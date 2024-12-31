import express from 'express';
import Product from '../models/product.js';
import Vendor from '../models/vendor.js';
import { productSchema } from '../utils/zodSchemas.js';
import { productImageUpload } from '../utils/multer.js';

const router = express.Router();

// Add a new product
router.post('/add', productImageUpload, async (req, res) => {
    try {
        const parsedData = productSchema.parse(req.body);
        const { name, description, price, vendorId, category, stock, tags } = parsedData;

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
            tags
        });

        const savedProduct = await newProduct.save();
        vendor.products.push(savedProduct._id);
        await vendor.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
});


// Modify an existing product
router.put('/modify/:id', async (req, res) => {
    try {
        const parsedData = productSchema.partial().parse(req.body);
        const { id } = req.params;

        const updatedProduct = await Product.findByIdAndUpdate(id, parsedData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
});

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