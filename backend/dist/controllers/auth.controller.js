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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const express_1 = require("express");
const route = (0, express_1.Router)(); // Create the router
// Signup route handler with proper typing
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("signup");
    // You can implement your signup logic here
    res.send("Signup route");
});
exports.signup = signup;
// Login route handler with proper typing
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    // You can implement your login logic here
    res.send("Login route");
});
exports.login = login;
// Logout route handler with proper typing
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("logout");
    // You can implement your logout logic here
    res.send("Logout route");
});
exports.logout = logout;
// Export the router to use in the main application
exports.default = route;
