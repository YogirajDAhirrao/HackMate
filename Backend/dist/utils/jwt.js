import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, COOKIE_EXPIRES_IN, IS_PRODUCTION, } from "../config/config.js";
export const signToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
export const sendTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        expires: new Date(Date.now() + COOKIE_EXPIRES_IN),
    });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
