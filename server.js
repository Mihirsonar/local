import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";

const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    // Middleware
    app.use(cors({ origin: '*' }));
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Routes
    app.get('/', (req, res) => {
      res.send('Backend is running successfully!');
    });
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/orders", orderRoutes); // Add route for orders

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1); // Exit the process with failure
  }
};
startServer();
