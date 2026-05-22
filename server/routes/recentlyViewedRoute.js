import express from "express";

const recentlyViewedRouter = express.Router();

// ─── COOKIES vs SESSIONS ───────────────────────────────────────────
// We use COOKIES here (not sessions) because:
// - Recently viewed is not sensitive data
// - We want it to persist even after browser closes (maxAge)
// - No need to store on server — saves DB space
// - Small data (just 5 product IDs)
//
// SIGNED cookies:
// - cookieParser(secret) signs the cookie value with HMAC
// - If someone tampers with the cookie, signature won't match
// - Server rejects tampered cookies automatically
// - req.signedCookies instead of req.cookies
// ──────────────────────────────────────────────────────────────────

// GET recently viewed
recentlyViewedRouter.get("/", (req, res) => {
  const viewed = req.signedCookies.recentlyViewed;

  // Parse cookie or return empty array
  const productIds = viewed ? JSON.parse(viewed) : [];

  res.json({
    success: true,
    productIds,
  });
});

// ADD to recently viewed
recentlyViewedRouter.post("/add", (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: "Product ID required" });
  }

  // Get existing viewed products from signed cookie
  const existing = req.signedCookies.recentlyViewed;
  let viewed = existing ? JSON.parse(existing) : [];

  // Remove if already exists (to move it to front)
  viewed = viewed.filter((id) => id !== productId);

  // Add to front
  viewed.unshift(productId);

  // Keep only last 5
  viewed = viewed.slice(0, 5);

  // Set signed cookie
  // httpOnly: JS cannot read it
  // signed: tamper-proof
  // maxAge: 30 days
  res.cookie("recentlyViewed", JSON.stringify(viewed), {
    httpOnly: true,
    signed: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "lax",
  });

  res.json({
    success: true,
    productIds: viewed,
  });
});

// CLEAR recently viewed
recentlyViewedRouter.post("/clear", (req, res) => {
  res.clearCookie("recentlyViewed");
  res.json({ success: true, message: "Recently viewed cleared" });
});

export default recentlyViewedRouter;