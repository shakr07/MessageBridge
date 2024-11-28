import jwt from "jsonwebtoken";
import { Response } from "express";
import { toEditorSettings } from "typescript";
export const generateToken = (userId: string, res: Response):any => {
    try {
      // Ensure the JWT_SECRET environment variable is set
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
  
      // Generate the JWT token
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
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
    } catch (error:any) {
      console.error("Error generating token:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }



  };