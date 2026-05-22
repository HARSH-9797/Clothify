import express from "express";
import authUser from "../middleware/auth.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.use(authUser); // all wishlist routes need login

wishlistRouter.get("/", getWishlist);
wishlistRouter.post("/add", addToWishlist);
wishlistRouter.post("/remove", removeFromWishlist);

export default wishlistRouter;