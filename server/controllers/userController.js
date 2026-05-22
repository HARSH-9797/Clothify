import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cartModel from "../models/cartModel.js";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, name: user.name });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ── MERGE GUEST CART INTO USER CART ──────────────────────────
    // If the user had items in guest cart (session) before logging in,
    // merge those items into their saved cart in MongoDB
    const guestCart = req.session?.guestCart || {};

    if (Object.keys(guestCart).length > 0) {
      // Find or create user's cart
      let cart = await cartModel.findOne({ userId: user._id });

      if (!cart) {
        cart = new cartModel({ userId: user._id, items: {} });
      }

      // Merge: add guest cart quantities to existing cart
      const existingItems = Object.fromEntries(cart.items || new Map());

      for (const [itemId, quantity] of Object.entries(guestCart)) {
        existingItems[itemId] = (existingItems[itemId] || 0) + quantity;
      }

      // Save merged cart
      await cartModel.findOneAndUpdate(
        { userId: user._id },
        { $set: { items: existingItems } },
        { upsert: true }
      );

      // Clear guest cart from session after merge
      req.session.guestCart = {};

      console.log(`Guest cart merged for user ${user.email} ✅`);
    }

    res.json({ success: true, token, name: user.name });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};