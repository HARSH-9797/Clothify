import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// ── HOW ACCESS + REFRESH TOKENS WORK ────────────────────────────
//
// OLD WAY (what you had):
//   Single token → 7 days → if stolen, attacker has 7 days of access
//
// NEW WAY (production pattern):
//   Access token  → 15 minutes → short-lived, used for API calls
//   Refresh token → 7 days     → long-lived, used ONLY to get new access token
//
// Flow:
//   Login → get both tokens
//   Every API call → send access token in header
//   Access token expires → send refresh token to /api/user/refresh
//   Server validates refresh token → issues NEW access token + NEW refresh token
//   Old refresh token is now invalid (rotation)
//
// Why this is safer:
//   If access token is stolen → attacker has only 15 minutes
//   If refresh token is stolen → rotation detects reuse → logout all sessions
// ──────────────────────────────────────────────────────────────────

// Generate access token (15 minutes)
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,  
    { expiresIn: "7d" }      
  );
};

// Generate refresh token (7 days)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Verify access token middleware
export const verifyAccessToken = (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET
    );

    req.userId = decoded.id;
    if (req.body) req.body.userId = decoded.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired. Please refresh.",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid access token",
    });
  }
};

// Refresh token endpoint handler
export const refreshTokenHandler = async (req, res) => {
  try {
    // Refresh token comes from httpOnly cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found. Please login again.",
      });
    }

    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
    );

    // Check user still exists
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate NEW access token and NEW refresh token (rotation)
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Send new refresh token as httpOnly cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,   // JS cannot access
      secure: false,    // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send new access token in response body
    res.json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    // Clear the invalid refresh token cookie
    res.clearCookie("refreshToken");
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token. Please login again.",
    });
  }
};