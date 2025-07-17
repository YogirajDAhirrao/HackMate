import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
const verifyJWT = (req, res, next) => {
    const token = req.cookies?.token;
    console.log(token);
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; // attach to request object
        console.log(req.userId, "JWT");
        next(); // pass control to the next middleware
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: "Invalid or expired token." });
    }
};
export default verifyJWT;
