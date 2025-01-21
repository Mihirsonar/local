import express from 'express';
import { addProduct,getProductById,getProducts,updateProduct,deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.post("/", addProduct); // Add a new product
router.get("/", getProducts); // Get all products
router.get("/:id", getProductById); // Get a product by ID
router.put("/:id", updateProduct); // Update a product
router.delete("/:id", deleteProduct); // Delete a product

export default router;