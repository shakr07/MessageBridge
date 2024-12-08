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
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = __importDefault(require("../db/prisma.js"));
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
        if (!token) {
            res.status(401).json({ error: "Unauthorized - No token provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ error: "Unauthorized - Invalid Token" });
            return;
        }
        const user = yield prisma_js_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, fullName: true, profilePic: true },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        req.user = user; // Attach user to the request object
        next(); // Proceed to the next middleware or controller
    }
    catch (error) {
        console.error("Error in protectRoute middleware", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.protectRoute = protectRoute;
exports.default = exports.protectRoute;
