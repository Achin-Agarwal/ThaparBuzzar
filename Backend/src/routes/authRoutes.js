import express from "express";
import axios from "axios";
import { jwt } from "jsonwebtoken";
import { oauth2Client } from "../../utils/googleClient";
const router = express.Router();
import config from "../config/config";
import Buyer from "../models/buyer";
import Seller from "../models/seller";



router.get("/google", async (req, res, next) => {
    const code = req.query.code;
    const role = req.query.role;
    if (!role)
        res.status(400).json({ message: "Role is required" });

    if (role !== "buyer" && role !== "seller")
        res.status(400).json({ message: "Role must be either buyer or seller" });

    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/buyerinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;
    console.log("userRes: ");
    console.log(userRes);


    if (role === "buyer") {

        const user = await Buyer.findOne({ email });

        if (!user) {
            buyer = await Buyer.create({
                name,
                email.address: email,
                image: picture,
            });
        }
    }

    const { _id } = buyer;
    const token = jwt.sign({ _id, email },
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
    });
    res.status(200).json({
        message: 'success',
        token,
        buyer,
    });

});
export default router;
