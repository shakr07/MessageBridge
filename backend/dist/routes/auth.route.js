"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js"); // Use .js if controllers are in JS
const router = (0, express_1.Router)();
//POST request for login, register, and logout
router.post("/login", auth_controller_js_1.login);
router.post("/logout", auth_controller_js_1.logout);
router.post("/register", auth_controller_js_1.signup);
exports.default = router;
