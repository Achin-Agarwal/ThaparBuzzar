import express from "express";
import Buyer from "../models/buyer.js";
import Seller from "../models/seller.js";
import bcrypt from "bcrypt";

const router = express.Router();

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
