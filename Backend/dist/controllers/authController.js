import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import { JWT_SECRET } from "../config/config.js";
// Utility function to set cookie consistently
const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none", // For cross-origin cookies
        secure: true, // Required for SameSite=None
        path: "/",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
};
// SIGNUP
export const signup = async (req, res, next) => {
    const { name, email, password, interests, skills, bio, github } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            interests,
            skills,
            bio,
            github,
            slug,
        });
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "7d",
        });
        setAuthCookie(res, token);
        res
            .status(201)
            .json({ message: "User registered successfully", userId: user._id });
    }
    catch (error) {
        next(error);
    }
};
// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "7d",
        });
        setAuthCookie(res, token);
        console.log(`Login successful: ${user.name}`);
        res.status(200).json({ token, userId: user._id });
    }
    catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};
// LOGOUT
export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/",
            expires: new Date(0), // Immediately expire
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Logout failed", error });
    }
};
