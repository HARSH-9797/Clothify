import Razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import { io } from "../server.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── STEP 1: CREATE RAZORPAY ORDER ────────────────────────────────
// When user clicks "Pay with Razorpay":
// 1. We create an order in Razorpay (gets an order ID)
// 2. We create a pending order in our MongoDB
// 3. Return Razorpay order ID to React
// 4. React opens Razorpay payment popup
export const createRazorpayOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // Amount must be in paise (1 INR = 100 paise)
    const amountInPaise = amount * 100;

    // Create order in Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Create pending order in our MongoDB
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,           // not paid yet
      status: "Order Placed",
      razorpayOrderId: razorpayOrder.id,
      date: Date.now(),
    });

    await newOrder.save();

    // Return Razorpay order details to React
    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: newOrder._id,    // our MongoDB order ID
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── STEP 2: VERIFY PAYMENT ───────────────────────────────────────
// After user completes payment in Razorpay popup:
// 1. Razorpay sends payment details to React
// 2. React sends them to our backend
// 3. We verify the signature (proves payment is genuine)
// 4. We update order as paid in MongoDB
// 5. We clear the cart
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      userId,
    } = req.body;

    // ── SIGNATURE VERIFICATION ─────────────────────────────────
    // Razorpay signs the payment with HMAC-SHA256
    // We recreate the signature and compare
    // If they match → payment is genuine
    // If they don't → payment was tampered with
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // Payment is genuine — update order in MongoDB
    await orderModel.findByIdAndUpdate(orderId, {
      payment: true,
      status: "Packing",
      razorpayPaymentId: razorpay_payment_id,
    });

    // Clear the user's cart
    await cartModel.findOneAndUpdate(
      { userId },
      { $set: { items: {} } },
      { upsert: true }
    );

    // Notify admin via Socket.io
    io.to("adminRoom").emit("newOrder", {
      orderId,
      amount: req.body.amount,
      status: "Packing",
      paymentMethod: "Razorpay",
      date: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Payment verified successfully!",
    });

  } catch (error) {
    console.log("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── COD ORDER ────────────────────────────────────────────────────
// Cash on Delivery — no payment verification needed
// Just create order and clear cart
export const placeCODOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });

    await newOrder.save();

    // Clear cart
    await cartModel.findOneAndUpdate(
      { userId },
      { $set: { items: {} } },
      { upsert: true }
    );

    // Notify admin
    io.to("adminRoom").emit("newOrder", {
      orderId: newOrder._id,
      amount: newOrder.amount,
      status: "Order Placed",
      paymentMethod: "COD",
      date: new Date().toISOString(),
    });

    res.json({ success: true, message: "Order placed successfully!" });

  } catch (error) {
    console.log("COD ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};