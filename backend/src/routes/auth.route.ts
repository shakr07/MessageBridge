import express from "express";
import { Router } from "express";
import { login, signup, logout } from "../controllers/auth.controller.js"; // Use .js if controllers are in JS

const router = Router();

//POST request for login, register, and logout
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", signup);   

export default router;
