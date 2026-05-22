import express from "express";
import authUser from "../middleware/auth.js";
import { placeOrder, userOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();
orderRouter.delete("/delete/:id", authUser, async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

orderRouter.post("/place",authUser,placeOrder)
orderRouter.post("/userorders",authUser,userOrders)

export default orderRouter;