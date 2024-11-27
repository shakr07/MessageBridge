import express, { Express, Request, Response } from "express"; // Fixed the import syntax
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";


dotenv.config();
const app: Express = express();

app.use( express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express");
});

// Define routes

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(5003, () => {
  console.log("Server is running on http://localhost:5003"); 
});
