import express from "express";
import axios from "axios";
import pkg from 'jsonwebtoken';
const { jwt } = pkg;
import { oauth2Client } from "../utils/googleClient.js";
const router = express.Router();
import config from "..//config/config.js";
import Buyer from "../models/buyer.js";
import Seller from "../models/seller.js";



router.post("/google", async (req, res, next) => {
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
    console.log("*********************************************************************************************************************************");
    console.log("userRes: ");
    console.log(userRes);
    console.log("*********************************************************************************************************************************");


    if (role === "buyer") {

        const user = await Buyer.findOne({ "email.adress": email });

        if (!user) {
            buyer = await Buyer.create({
                name,
                email:{address: email,isVerified: true},
                image: picture,
            });
        }
    }

    if (role === "seller") {

        const user = await Seller.findOne({ "email.adress": email });

        if (!user) {
            buyer = await Seller.create({
                name,
                email:{address: email,isVerified: true},
                image: picture,
            });
        }
    }
    const { _id } = buyer;
    const token = jwt.sign({ _id, email,role },
        config.jwt.secret, {
        expiresIn: config.jwt.timeout,
    });
    res.status(200).json({
        message: 'user created successfully',
        token,
        buyer,
    });

});
export default router;
