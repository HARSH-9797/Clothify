import express from "express";

const guestCartRouter = express.Router();

// ─── HOW THIS WORKS ───────────────────────────────────────────────
// Guest (not logged in) adds to cart
// → stored in req.session.guestCart (server-side, MongoDB sessions collection)
// → browser only gets a session ID cookie (connect.sid)
//
// When guest logs in:
// → we merge req.session.guestCart into their DB cart
// → destroy the session
//
// This is the key difference from JWT:
// JWT = stateless (server remembers nothing, token has all info)
// Session = stateful (server remembers everything, client has only an ID)
// ──────────────────────────────────────────────────────────────────

// GET guest cart
guestCartRouter.get("/", (req, res) => {
  res.json({
    success: true,
    cartData: req.session.guestCart || {},
    sessionID: req.sessionID,
  });
});

// ADD to guest cart
guestCartRouter.post("/add", (req, res) => {
  const { itemId } = req.body;

  if (!itemId) {
    return res.status(400).json({ success: false, message: "Item ID required" });
  }

  // Initialize guest cart if it doesn't exist
  if (!req.session.guestCart) {
    req.session.guestCart = {};
  }

  // Add item or increment quantity
  req.session.guestCart[itemId] = (req.session.guestCart[itemId] || 0) + 1;

  res.json({
    success: true,
    message: "Added to guest cart",
    cartData: req.session.guestCart,
  });
});

// REMOVE from guest cart
guestCartRouter.post("/remove", (req, res) => {
  const { itemId } = req.body;

  if (!req.session.guestCart || !req.session.guestCart[itemId]) {
    return res.json({ success: true, cartData: req.session.guestCart || {} });
  }

  delete req.session.guestCart[itemId];

  res.json({
    success: true,
    cartData: req.session.guestCart,
  });
});

// CLEAR guest cart
guestCartRouter.post("/clear", (req, res) => {
  req.session.guestCart = {};
  res.json({ success: true, message: "Guest cart cleared" });
});

export default guestCartRouter;