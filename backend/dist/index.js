"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Fixed the import syntax
const auth_route_js_1 = __importDefault(require("./routes/auth.route.js"));
const message_route_js_1 = __importDefault(require("./routes/message.route.js"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("Hello from Express");
});
// Define routes
app.use("/api/auth", auth_route_js_1.default);
app.use("/api/messages", message_route_js_1.default);
app.listen(5003, () => {
    console.log("Server is running on http://localhost:5003");
});
