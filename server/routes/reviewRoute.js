import express from "express";
import authUser from "../middleware/auth.js";
import { addReview, getReviews, deleteReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.get("/:productId", getReviews);           // public
reviewRouter.post("/add", authUser, addReview);         // logged in
reviewRouter.delete("/:id", authUser, deleteReview);    // logged in

export default reviewRouter;