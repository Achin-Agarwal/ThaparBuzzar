import express from "express";
import nodemailer from "nodemailer";
import otpModel from "../models/otp.js";
import User from "../models/user.js";
import Vendor from "../models/vendor.js";
import bcrypt from "bcrypt";

const router = express.Router();


router.post("/", async (req, res) => {
    const { email, role } = req.body;

    // let user;
    // if (role === "user") {
    //     user = await User.findOne({ email });
    // } else if (role === "vendor") {
    //     user = await Vendor.findOne({ email });
    // } else {
    //     return res.status(400).json({ message: "user does not exist" });
          
    // }

    // if (!user) {
    //     return res.status(404).json({ message: "Email not registered as the given role" });
    // }

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

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
        subject: "Your OTP for Password Reset",
        text: `Your OTP for password reset is: ${otp}`,
    };

    
        const validTill = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        const newOtp = new otpModel({
            user: email,
            otp: otp,
            validTill: validTill
        });

        await newOtp.save();
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent successfully" });
   
});
router.put("/", async (req, res) => {
    const { email, otp, newPassword,role } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const otpRecord = await otpModel.findOne({ user: email, otp: otp });

    if (!otpRecord) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.validTill < new Date()) {
        return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let user;
    if (await User.findOne({ email })) {
        user = await User.findOneAndUpdate({ email }, { password: hashedPassword });
    } else if (await Vendor.findOne({ email })) {
        user = await Vendor.findOneAndUpdate({ email }, { password: hashedPassword });
    } else {
        return res.status(400).json({ message: "User does not exist" });
    }

    await otpModel.deleteOne({ user: email, otp: otp });

    res.status(200).json({ message: "Password updated successfully" });
});

export default router;