import express, { Request, Response } from "express";  // Correct import syntax
import { Router } from "express";

const router = Router();

// Define your route handler
router.get("/conversations", (req: Request, res: Response) => {
  // Implement your logic for this route
  res.send("List of conversations");  // Example response
});

// Export the router
export default router;
