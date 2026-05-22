import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userModel from "../models/userModel.js";

// ── JWT STRATEGY ─────────────────────────────────────────────────
// This strategy reads the JWT from the Authorization header
// and finds the user from the database
// Used as an alternative to our manual authUser middleware
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userModel.findById(payload.id);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// ── GOOGLE STRATEGY ──────────────────────────────────────────────
// When user clicks "Sign in with Google":
// 1. Google redirects to our callback URL with a code
// 2. Passport exchanges the code for user profile
// 3. We find or create the user in our DB
// 4. We issue our own JWT tokens
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await userModel.findOne({ googleId: profile.id });

        if (!user) {
          // Check if email already registered normally
          user = await userModel.findOne({
            email: profile.emails[0].value,
          });

          if (user) {
            // Link Google ID to existing account
            user.googleId = profile.id;
            await user.save();
          } else {
            // Create brand new user
            user = await userModel.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              password: "google-oauth-" + profile.id, // placeholder
              role: "user",
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;