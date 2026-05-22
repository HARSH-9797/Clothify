import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/get", authUser, getCart);
cartRouter.post("/remove", authUser, removeFromCart);

export default cartRouter;