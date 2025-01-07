import express from "express";
import nodemailer from "nodemailer";
import otpModel from "../models/otp.js";
import Buyer from "../models/buyer.js";
import Seller from "../models/seller.js";
import bcrypt from "bcrypt";

const router = express.Router();


router.post("/", async (req, res) => {  
    const { email, role } = req.body;
    await otpModel.deleteMany({ user: email, role: role });

    console.log(role);
    // let buyer;
    // if (role === "buyer") {
    //     buyer = await Buyer.findOne({ email });
    // } else if (role === "seller") {
    //     buyer = await Seller.findOne({ email });
    // } else {
    //     return res.status(200).json({ message: "buyer does not exist" });

    // }

    // if (!buyer) {
    //     return res.status(404).json({ message: "Email not registered as the given role" });
    // }

    if (!email) {
        return res.status(200).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "devanshvashishat@gmail.com",
            pass: "eesmkobbawbhpcuz",
        },
    });

    // Email options
    const mailOptions = {
        from: "devanshvashishat@gmail.com",
        to: email,
        subject: "Email verification",
        text: `Your OTP for email verification  is: ${otp}`,
    };


    const validTill = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    const newOtp = new otpModel({
       user: email,
        otp: otp,
        validTill: validTill,
        role: role,
    });

    await newOtp.save();
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });

});
router.put("/verifyotp", async (req, res) => {
    const { email, otp, role } = req.body;

    if (!email || !otp || !role) {
        return res.status(200).json({ message: "Email, OTP, and role are required" });
    }


    const otpRecord = await otpModel.findOne({ user: email, role: role, otp: otp });
    if (!otpRecord) {
        return res.status(200).json({ message: "Invalid OTP" });
    }
  

    if (otpRecord.validTill < new Date()) {
        return res.status(200).json({ message: "OTP has expired" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
});
export default router;