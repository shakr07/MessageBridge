import express, { Request, Response } from "express";  // Correct import syntax
import { Router } from "express";
import protectRoute from "../midldleware/protected";
import { sendMessage,getMessages,getUserForSideBar } from "../controllers/message.controller";

const router = Router();
router.get("/conversations",protectRoute,getUserForSideBar);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessage);



// Export the router
export default router;
