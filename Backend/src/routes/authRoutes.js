import express from "express";
import axios from "axios";
import { jwt } from "jsonwebtoken";
import { oauth2Client } from "../../utils/googleClient";
const router = express.Router();
import config from "../config/config";


router.get("/google", async (req, res, next) => {
    const code = req.query.code;
    const role = req.query.role;
    if (!role)
        res.status(400).json({ message: "Role is required" });

    if (role !== "buyer" && role !== "seller")
        res.status(400).json({ message: "Role must be either buyer or seller" });

    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const buyerRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/buyerinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = buyerRes.data;
    // console.log(buyerRes);
    let buyer = await Buyer.findOne({ email });

    if (!buyer) {
        buyer = await Buyer.create({
            name,
            email,
            image: picture,
        });
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
