"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../db/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generatetoken_1 = require("../utils/generatetoken");
const route = (0, express_1.Router)();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill the fields" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "password and confirm password do not match with each other" });
        }
        const user = yield prisma_1.default.user.findUnique({
            where: {
                username
            }
        });
        if (user) {
            return res.status(400).json({ error: "User exists" });
        }
        //by crypting of the message 
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashpasswor = yield bcryptjs_1.default.hash(password, salt);
        const profilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const newUser = yield prisma_1.default.user.create({
            data: {
                fullName,
                username,
                password: hashpasswor,
                gender,
                profilePic: profilePic
            }
        });
        //if newuser is created
        if (newUser) {
            newUser;
            //generating the token for Jwt
            (0, generatetoken_1.generateToken)(newUser.id, res);
            res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(400).json({ error: "Invalid Data" });
        }
    }
    catch (error) {
        console.log("User not Created some error");
        res.status(500).json({ error: "Error in creating the user" });
    }
});
exports.signup = signup;
//        --login Code--
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield prisma_1.default.user.findUnique({
            where: {
                username: username
            }
        });
        if (!user) {
            return res.send(400).json({ error: "Invalid usename" });
        }
        const ispasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (ispasswordCorrect === true) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        (0, generatetoken_1.generateToken)(user.id, res);
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.usename,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.log(error);
    }
    res.send("Login route");
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("logout");
    res.send("Logout route");
});
exports.logout = logout;
exports.default = route;
