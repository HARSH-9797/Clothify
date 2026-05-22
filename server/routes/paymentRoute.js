import express from "express";
import authUser from "../middleware/auth.js";
import {
  createRazorpayOrder,
  verifyPayment,
  placeCODOrder,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// All payment routes require authentication
paymentRouter.use(authUser);

// Create Razorpay order (Step 1)
paymentRouter.post("/razorpay/create", createRazorpayOrder);

// Verify payment after user pays (Step 2)
paymentRouter.post("/razorpay/verify", verifyPayment);

// Cash on delivery
paymentRouter.post("/cod", placeCODOrder);

export default paymentRouter;