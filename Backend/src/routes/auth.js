import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken"; // For ES modules
// OR
import { oauth2Client } from "../utils/googleClient.js";
const router = express.Router();
import config from "..//config/config.js";
import Buyer from "../models/buyer.js";
import Seller from "../models/seller.js";
import Admin from "../models/admin.js";
import bcrypt from "bcrypt";



router.post("/google", async (req, res, next) => {
    console.log("google auth");
    const code = req.query.code;
    const role = req.query.role;
    console.log("code: ");
    console.log(code);
    console.log("role: ");
    console.log(role);

    if (!role)
        res.status(400).json({ message: "Role is required" });

    // if (role !== "buyer" && role !== "seller")
    //     res.status(400).json({ message: "Role must be either buyer or seller" });

    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;
    // console.log("*********************************************************************************************************************************");
    // console.log("userRes: ");
    // console.log(userRes);
    // console.log("*********************************************************************************************************************************");

    let newuser;
    // let _id;
    // le
    if (role === "buyer") {

        const user = await Buyer.findOne({ "email.address": email });
        // console.log("user: ");
        // console.log(user);
        if (!user) {
            newuser = await Buyer.create({
                name,
                email: { address: email, isVerified: true },
                image: picture,
            });
            const { _id } = newuser;
            const token = jwt.sign({ _id, email, role },
                config.jwt.secret, {
                expiresIn: config.jwt.timeout,
            });
            res.status(200).json({
                message: 'user created successfully',
                token,
                newuser,
            });
        }
        const { _id } = user;
        const token = jwt.sign({ _id, email, role },
            config.jwt.secret, {
            expiresIn: config.jwt.timeout,
        });
        res.status(200).json({
            message: 'user created successfully',
            token,
            user,
        });
    }

    if (role === "seller") {

        const user = await Seller.findOne({ "email.address": email });


        if (!user) {
            newuser = await Seller.create({
                name,
                email: { address: email, isVerified: true },
                image: picture,
            });
            const { _id } = newuser;
            const token = jwt.sign({ _id, email, role },
                config.jwt.secret, {
                expiresIn: config.jwt.timeout,
            });
            res.status(200).json({
                message: 'user created successfully',
                token,
                newuser,
            });

        }
        const { _id } = user;
        const token = jwt.sign({ _id, email, role },
            config.jwt.secret, {
            expiresIn: config.jwt.timeout,
        });
        res.status(200).json({
            message: 'user created successfully',
            token,
            user,
        });

    }


});

router.post("/login", async (req, res, next) => {
    console.log("login");
    const { email, role, password } = req.body;
    console.log("email: ");
    console.log(email);
    console.log("role: ");
    console.log(role);
    console.log("password: ");
    console.log (password);
    if (!email || !role) {
        return res.status(400).json({ message: "Email and role are required" });
    }
    // if (role !== "buyer"  role !== "seller") {
    //     return res.status(400).json({ message: "Role must be either buyer or seller" });
    // }


    let user;
    if (role === "buyer") {
        user = await Buyer.findOne({ "email.address": email });
    } else if (role === "seller") {
        user = await Seller.findOne({ "email.address": email });
    }else if (role === "admin") {
        user = await Admin.findOne({ email });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.password === "account createdby google") {
        return res.status(401).json({ message: "sign in with google instead" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const { _id } = user;
    const token = jwt.sign({ _id, email, role }, config.jwt.secret, {
        expiresIn: config.jwt.timeout,
    });
    res.status(200).json({ message: "Login successful", token, user });
});
export default router;
