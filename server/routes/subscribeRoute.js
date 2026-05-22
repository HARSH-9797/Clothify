import express from "express";
import nodemailer from "nodemailer";

const subscribeRouter = express.Router();

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

subscribeRouter.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    // Send welcome email to the subscriber
    await transporter.sendMail({
      from: `"Clothify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Clothify Newsletter! 🛍️",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7C3AED, #EC4899); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Clothify</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Fashion that stands out</p>
          </div>
          <div style="background: #1E293B; padding: 40px; border-radius: 0 0 12px 12px;">
            <h2 style="color: white;">Welcome to the family! 🎉</h2>
            <p style="color: #94A3B8; line-height: 1.6;">
              Thank you for subscribing to Clothify newsletter. You'll be the first to know about:
            </p>
            <ul style="color: #94A3B8; line-height: 2;">
              <li>New collection launches</li>
              <li>Exclusive discounts and offers</li>
              <li>Fashion tips and trends</li>
              <li>Early access to sales</li>
            </ul>
            <a href="http://localhost:5173/collection" 
               style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: bold;">
              Shop Now →
            </a>
            <p style="color: #475569; font-size: 12px; margin-top: 30px;">
              © 2026 Clothify. Made with ❤️ in India
            </p>
          </div>
        </div>
      `
    });

    res.json({ success: true, message: "Subscribed successfully!" });

  } catch (error) {
    console.log("EMAIL ERROR:", error.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

export default subscribeRouter;