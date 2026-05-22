import cartModel from "../models/cartModel.js";

// Helper: converts Mongoose Map to plain JS object safely
const toPlainObject = (map) => {
  if (!map) return {};
  if (map instanceof Map) {
    return Object.fromEntries(map);  // Map → plain object
  }
  return { ...map };
};

// 🔹 ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.json({ success: false, message: "Missing data" });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({ userId, items: {} });
    }

    // Convert Mongoose Map to plain object safely
    const items = toPlainObject(cart.items);

    items[itemId] = items[itemId] ? items[itemId] + 1 : 1;

    // Use findOneAndUpdate instead of save — avoids Map casting issues
    const updated = await cartModel.findOneAndUpdate(
      { userId },
      { $set: { items } },
      { new: true, upsert: true }
    );

    res.json({ success: true, cartData: toPlainObject(updated.items) });

  } catch (error) {
    console.log("ADD ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 GET CART
export const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: true, cartData: {} });
    }

    const cart = await cartModel.findOne({ userId });

    res.json({ success: true, cartData: toPlainObject(cart?.items) });

  } catch (error) {
    console.log("GET ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.json({ success: false });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.json({ success: true, cartData: {} });
    }

    const items = toPlainObject(cart.items);

    delete items[itemId];

    const updated = await cartModel.findOneAndUpdate(
      { userId },
      { $set: { items } },
      { new: true }
    );

    res.json({ success: true, cartData: toPlainObject(updated.items) });

  } catch (error) {
    console.log("REMOVE ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};