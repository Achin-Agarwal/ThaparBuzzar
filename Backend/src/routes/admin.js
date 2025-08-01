import express from "express";
import Buyer from "../models/buyer.js";
import islogin from "../middleware/isLogin.js";
import Seller from "../models/seller.js";
import Admin from "../models/admin.js";
import Announcement from "../models/announcements.js";
import { safeHandler } from "../middleware/safeHandler.js";

const router = express.Router();

router.get("/pendingAnnouncements", islogin, safeHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    const announcements = await Announcement.find({
        isApproved: false,
        isDisapproved: false
    });
    res.status(200).json({ announcements });
}));
router.get("/approvedAnnouncements", islogin, safeHandler(async (req, res) => {
    const announcements = await Announcement.find({ isApproved: true });
    res.status(200).json({ announcements });
}));

router.get("/disapprovedAnnouncements", islogin, safeHandler(async (req, res) => {
    const announcements = await Announcement.find({ isDisapproved: true });
    res.status(200).json({ announcements });
}));
router.get("/approve/:id", islogin, safeHandler(async (req, res) => {
    const { id } = req.params;


    const announcement = await Announcement.findById(id);
    if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
    }

    const approvedOn = new Date();
    const validityPeriod = announcement.days || 0; // Default to 0 days if not provided
    const expiresOn = new Date(approvedOn.getTime() + validityPeriod * 24 * 60 * 60 * 1000);

    announcement.isApproved = true;
    announcement.approvedOn = approvedOn;
    announcement.expiresin = expiresOn;

    await announcement.save();

    res.status(200).json({
        message: "Announcement approved successfully",
        announcement,
    });

}));

router.get("/dissapprove/:id", safeHandler(async (req, res) => {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndUpdate(id, { isDisapproved: true, isApproved: false }, { new: true });
    res.status(200).json({ message: "Announcement dissapproved successfully", announcement });
}));
router.get("/getanouncements", safeHandler(async (req, res) => {
    const announcements = await Announcement.find({
        isApproved: true,
        expiresin: { $gt: new Date() }
    });

    const productImages = announcements.reduce((images, announcement) => {
        return images.concat(announcement.images.productImages);
    }, []);

    res.status(200).json({ productImages });
}));
export default router;