"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const protected_js_1 = __importDefault(require("../midldleware/protected.js"));
const router = express_1.default.Router();
router.get("/me", protected_js_1.default, auth_controller_js_1.getMe);
router.post("/signup", auth_controller_js_1.signup);
router.post("/login", auth_controller_js_1.login);
router.post("/logout", auth_controller_js_1.logout);
exports.default = router;
