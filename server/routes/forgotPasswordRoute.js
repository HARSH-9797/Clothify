import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import userModel from "../models/userModel.js";

const forgotRouter = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// STEP 1: Send reset email
forgotRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Email not found" });
    }

    // Create reset token valid for 15 minutes
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Clothify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your Clothify password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7C3AED, #EC4899); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">Clothify</h1>
          </div>
          <div style="background: #1E293B; padding: 40px; border-radius: 0 0 12px 12px;">
            <h2 style="color: white;">Reset your password</h2>
            <p style="color: #94A3B8;">Click the button below to reset your password. This link expires in 15 minutes.</p>
            <a href="${resetLink}"
               style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: bold;">
              Reset Password →
            </a>
            <p style="color: #475569; font-size: 12px; margin-top: 30px;">
              If you didn't request this, ignore this email.
            </p>
          </div>
        </div>
      `
    });

    res.json({ success: true, message: "Reset link sent to your email!" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// STEP 2: Reset password
forgotRouter.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userModel.findByIdAndUpdate(decoded.id, {
      password: hashedPassword
    });

    res.json({ success: true, message: "Password reset successfully!" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Invalid or expired token" });
  }
});

export default forgotRouter;