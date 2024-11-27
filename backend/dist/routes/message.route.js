"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Define your route handler
router.get("/conversations", (req, res) => {
    // Implement your logic for this route
    res.send("List of conversations"); // Example response
});
// Export the router
exports.default = router;
