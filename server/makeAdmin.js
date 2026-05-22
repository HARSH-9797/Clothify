import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./models/userModel.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await userModel.findOneAndUpdate(
    { email: "harsh@testn.com" },
    { role: "admin" },
    { new: true }
  );
  console.log("Updated user:", result);
  process.exit();
});