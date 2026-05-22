import express from "express";
import passport from "../middleware/passport.js";
import {
  generateAccessToken,
  generateRefreshToken,
  refreshTokenHandler,
} from "../middleware/authTokens.js";

const authRouter = express.Router();

// ── GOOGLE OAUTH ROUTES ──────────────────────────────────────────

// Step 1: Redirect user to Google login page
// When user clicks "Sign in with Google" in React,
// redirect them to this route
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // what we want from Google
    session: false,              // we use JWT, not sessions
  })
);

// Step 2: Google redirects back here after user approves
// Google sends a code → passport exchanges it for user profile
// We issue our own JWT tokens
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login?error=google_failed",
  }),
  (req, res) => {
    const user = req.user;

    // Issue our own tokens
    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend with access token in URL
    // Frontend reads it and stores in localStorage
    res.redirect(
      `http://localhost:5173/auth/callback?token=${accessToken}&name=${encodeURIComponent(user.name)}`
    );
  }
);

// ── REFRESH TOKEN ROUTE ──────────────────────────────────────────
// Frontend calls this when access token expires
// Sends refresh token (from httpOnly cookie) → gets new access token
authRouter.post("/refresh", refreshTokenHandler);

// ── LOGOUT ROUTE ─────────────────────────────────────────────────
authRouter.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out successfully" });
});

export default authRouter;