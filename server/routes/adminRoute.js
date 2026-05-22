import { io } from "../server.js";
import express from "express";
import authUser from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const adminRouter = express.Router();

// Router-level middleware — applies to ALL routes in this router
// This is the key concept: authUser + requireAdmin on every admin route
// without repeating it on each individual route
adminRouter.use(authUser);        // Step 1: must be logged in
adminRouter.use(requireAdmin);    // Step 2: must be admin

// GET all orders
adminRouter.get("/orders", async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE order status
// UPDATE order status — emits to customer in real time
adminRouter.put("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;

    await orderModel.findByIdAndUpdate(req.params.id, { status });

    // ← Notify the customer watching this order instantly
    io.to(`order:${req.params.id}`).emit("statusUpdate", {
      orderId: req.params.id,
      status,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all products
adminRouter.get("/products", async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE product
adminRouter.delete("/products/:id", async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all users
adminRouter.get("/users", async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default adminRouter;