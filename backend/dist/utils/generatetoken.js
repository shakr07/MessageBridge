"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, res) => {
    try {
        // Ensure the JWT_SECRET environment variable is set
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        // Generate the JWT token
        const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "15d", // Token expires in 15 days
        });
        // Set the token as an HTTP-only, secure cookie
        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
            httpOnly: true, // Cookie cannot be accessed via client-side scripts
            sameSite: "strict", // Protect against CSRF
            secure: process.env.NODE_ENV !== "development", // Use HTTPS in production
        });
        return token;
    }
    catch (error) {
        console.error("Error generating token:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.generateToken = generateToken;
