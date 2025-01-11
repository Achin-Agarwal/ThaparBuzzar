import express from 'express';
import Product from '../models/product.js';
import Service from '../models/services.js';
import Seller from '../models/seller.js';
import Announcement from '../models/announcements.js';
import { productSchema } from '../utils/zodSchemas.js';
import { productImageUpload , multiImageUpload } from '../utils/multer.js';
import { safeHandler } from '../middleware/safeHandler.js';
import isLogin from '../middleware/isLogin.js';
const router = express.Router();

// Add an announcement
router.post('/addannouncement', isLogin, multiImageUpload, safeHandler(async (req, res) => {
    if (req.user.role === "buyer") {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    const { rateBifercation,days } = req.body;
    const sellerId = req.body.sellerId;
    console.log("Seller ID: "); console.log(sellerId);
    console.log("Rate bifercation: "); console.log(rateBifercation);
    console.log("Days: "); console.log(days);
    if (!sellerId) {
        return res.error(200, 'Seller ID is required', 'MISSING_VENDOR_ID');
    }
    const seller = await Seller.findById(sellerId);
    if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
    }
    console.log("**************************************************");
console.log("Seller: "); console.log(seller);
    // Collect filenames from uploaded files
    const paymentConfirmationImages = req.files.paymentConfirmation.map((file) => file.filename);
    const productImages = req.files.productImages.map((file) => file.filename);

    const newAnnouncement = new Announcement({
        sellerName: seller.sellerName,
        businessName: seller.businessName,
        rateBifercation,
        days,
        images: {
            paymentConfirmation: paymentConfirmationImages,
            productImages: productImages
        }
    });
    const savedAnnouncement = await newAnnouncement.save();

    seller.announcement.push(newAnnouncement);
    await seller.save();
    console.log("New announcement: "); console.log(newAnnouncement);
    res.status(201).json({ message: 'Announcement added successfully' });
}));
router.get("/userannouncements", isLogin, safeHandler(async (req, res) => {
    if (req.user.role === "buyer") {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    console.log(req.user);
    const user = await Seller.findById(req.user._id).populate("announcement").exec();
    res.json(user);
}));

// Add a new product
router.post('/addproduct', isLogin, productImageUpload, safeHandler(async (req, res) => {
    if (req.user.role === "buyer") {
        return res.status(401).json({ message: "Unauthorized access" });
    }
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

    if (!sellerId) {
        console.log(sellerId);
        return res.error(400, 'Seller ID is required', 'MISSING_VENDOR_ID');
    }
    const seller = await Seller.findById(sellerId);
    console.log("Seller: "); console.log(seller);
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
    if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
    }
    seller.products.push(savedProduct._id);
    await seller.save();

    res.status(201).json(savedProduct);

}));
router.patch('/addproduct', isLogin, productImageUpload, safeHandler(async (req, res) => {  

    const {updates} = req.body;
    const id = req.body.user._id;
    if(!isValid(productSchema, update)){
        return res.status(404).json({message: "user not found"});
    }
    
    const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value != null)
    );
    const product = await Product.findByIdAndUpdate(
        id,
        filteredUpdates,
        {
            new: true,
            runValidators: true 
        }
    );
    
res.sucess(200,"Product updated successfully",product);
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
router.get("/userproducts", isLogin, safeHandler(async (req, res) => {
    if (req.user.role === "buyer") {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    console.log(req.user);
    const user = await Seller.findById(req.user._id).populate("products").exec();
    res.json(user);
}));



router.post('/addservices', isLogin, productImageUpload, safeHandler(async (req, res) => {
    if (req.user.role === "buyer") {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    // Parse the incoming data
    const parsedData = {
        ...req.body,
        price: parseFloat(req.body.price),
        // stock: JSON.parse(req.body.stock),
        // promoCode: req.body.promoCode ? JSON.parse(req.body.promoCode) : undefined
    };
    console.log("body: ");
    console.log(req.body);
    console.log("parsed data: ");
    console.log(parsedData);
    
    const {domain, name ,price ,description, mobileNumber , additionalInfo } = parsedData;
    const sellerId = req.body.sellerId;

    console.log("Seller ID: "); console.log(sellerId);

    if (!sellerId) {
        console.log(sellerId);
        return res.error(400, 'Seller ID is required', 'MISSING_VENDOR_ID');
    }
    const seller = await Seller.findById(sellerId);
    console.log("Seller: "); console.log(seller);
    // Collect filenames from uploaded files
    const images = req.files.map((file) => file.filename);

    const newService = new Service({
        name,
        domain,
        price,
        description,
        seller: sellerId,
        image: images,
        mobileNumber,
        additionalInfo
    });
    const savedProduct = await newService.save();
    if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
    }
    seller.services.push(savedProduct._id);
    await seller.save();

    res.status(201).json(savedProduct);

}));



// Delete a product
router.delete('/deleteservice/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Service.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const seller = await Seller.findById(deletedProduct.seller);
        if (seller) {
            seller.services.pull(deletedProduct._id);
            await seller.save();
        }

        res.status(200).json({ message: 'service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/userservices", isLogin, safeHandler(async (req, res) => {
    if (req.user.role === "buyer") {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    console.log(req.user);
    const user = await Seller.findById(req.user._id).populate("services").exec();
    res.json(user);
}));

export default router;