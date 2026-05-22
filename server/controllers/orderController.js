import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import { io } from "../server.js";

// PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear cart
    await cartModel.findOneAndUpdate({ userId }, { items: {} });

    // ← Notify all admins instantly via Socket.io
    io.to("adminRoom").emit("newOrder", {
      orderId: newOrder._id,
      amount: newOrder.amount,
      status: newOrder.status,
      date: newOrder.date,
    });

    res.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// USER ORDERS
export const userOrders = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};