import jwt from "jsonwebtoken";
import config  from "../config/config.js";

const authenticate = (req, res, next) => {
    
    const token = req.headers.authorization?.split(" ")[1]; // Assumes Bearer token format

    if (!token) {
        return res.status(401).send("Access Denied. No token provided.");
    }

    try {
        const verified = jwt.verify(token, config.jwt.secret);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send("Invalid token.");
    }
};

export default authenticate;
