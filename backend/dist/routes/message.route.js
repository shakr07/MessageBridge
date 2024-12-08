"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protected_1 = __importDefault(require("../midldleware/protected"));
const message_controller_1 = require("../controllers/message.controller");
const router = (0, express_1.Router)();
router.get("/conversations", protected_1.default, message_controller_1.getUserForSideBar);
router.get("/:id", protected_1.default, message_controller_1.getMessages);
router.post("/send/:id", protected_1.default, message_controller_1.sendMessage);
// Export the router
exports.default = router;
