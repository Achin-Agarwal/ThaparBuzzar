import express from "express";
import nodemailer from "nodemailer";
import otpModel from "../models/otp.js";
import Buyer from "../models/buyer.js";
import Seller from "../models/seller.js";
import bcrypt from "bcrypt";
import isLogin from "../middleware/isLogin.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { email, role, name, password, number, sellerName, businessName } = req.body;
    console.log(email, role, name, password, number, sellerName, businessName);

    if (!email || !role || !name || !password) {
        return res.status(200).json({ message: "Email, role, name, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await (role === "buyer" ? Buyer.findOne({ "email.address": email }) : Seller.findOne({ "email.address": email }));

    if (existingUser) {
        return res.status(200).json({ message: "Email already registered" });
    }
    let user;
    if (role === "buyer") {
        // console.log("buyer creation block", role);
        user = new Buyer({
            name,
            email: { address: email, isVerified: true },
            password: hashedPassword,
            // birthday: dateOfBirth
            phoneNumber: number,
        });
    } else if (role === "seller") {
        // console.log("seller creation block", role);

        user = new Seller({
            // sellerName,
            email: { address: email, isVerified: true },
            password: hashedPassword,
            businessName: businessName,
            contactDetails: { email: email, phoneNumber: number },
        });
    } else {
        return res.status(400).json({ message: "Invalid role" });
    }
    console.log("user created");
    console.log(user);

    await user.save();

    const token = jwt.sign({ _id: user._id, email, role }, config.jwt.secret, {
        expiresIn: config.jwt.timeout,
    });

    res.status(201).json({
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
        token,
        user,
    });
});




router.post("/verifyemail", async (req, res) => {
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