import express from "express";
import { addProduct, listProducts, removeProduct } from "../controllers/productController.js";
import { upload } from "../middleware/cloudinary.js";
import authUser from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Public route
router.get("/list", listProducts);

// Admin only — upload.single("image") processes the file before controller runs
router.post("/add", authUser, requireAdmin, upload.single("image"), addProduct);
router.post("/remove", authUser, requireAdmin, removeProduct);

export default router;