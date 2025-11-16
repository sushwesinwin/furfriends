import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import petRoutes from "./src/routes/petRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
dotenv.config();

// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/auth", authRoutes);   
app.use("/api/pets", petRoutes);
app.use("/api/products", productRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
