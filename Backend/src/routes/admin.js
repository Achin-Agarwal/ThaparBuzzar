import express from "express";
import Buyer from "../models/buyer.js";
import islogin from "../middleware/isLogin.js";
import Seller from "../models/seller.js";
import Admin from "../models/admin.js";
import Announcement from "../models/announcements.js";

const router = express.Router();

router.get("/pendingAnnouncements",islogin,async (req, res) => {
    if (req.user.role !== "admin") {    
        return res.status(403).json({ message: "Forbidden" });
    }
        const announcements = await Announcement.find({ isApproved: false,
            isDisapproved: false });
            res.status(200).json({ announcements });
         });
router.get("/approvedAnnouncements", islogin, async (req, res) => {
    const announcements = await Announcement.find({ isApproved: true });
    res.status(200).json({ announcements });
});

router.get("/disapprovedAnnouncements", islogin, async (req, res) => {
    const announcements = await Announcement.find({ isDisapproved: true });
    res.status(200).json({ announcements });
});
export default router;