import express from "express";
import orderModel from "../models/orderModel.js";
import authUser from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";

const ejsRouter = express.Router();

// ejsRouter.use(authUser);
// ejsRouter.use(requireAdmin);

ejsRouter.get("/dashboard", async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 }).limit(20);

    const totalOrders = await orderModel.countDocuments();
    const totalRevenue = await orderModel.aggregate([
      { $match: { payment: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const pendingOrders = await orderModel.countDocuments({
      status: { $in: ["Order Placed", "Packing"] }
    });

    res.render("dashboard", {
      orders,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
      }
    });

  } catch (error) {
    res.status(500).send(`<h1>Error: ${error.message}</h1>`);
  }
});

ejsRouter.get("/invoice/:id", async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).send("<h1>Order not found</h1>");
    }

    res.render("invoice", { order });

  } catch (error) {
    res.status(500).send(`<h1>Error: ${error.message}</h1>`);
  }
});

export default ejsRouter;