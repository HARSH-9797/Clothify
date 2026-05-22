import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
// logs request 
import helmet from "helmet";  
// add security headers to responses
import rateLimit from "express-rate-limit";
// prevent too many requests
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
// reads cookies from requests
import passport from "./middleware/passport.js";
import reviewRouter from "./routes/reviewRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import forgotRouter from "./routes/forgotPasswordRoute.js";
import subscribeRouter from "./routes/subscribeRoute.js";
import cartRouter from "./routes/cartRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import productRouter from "./routes/productRoute.js";
import adminRouter from "./routes/adminRoute.js";
import authRouter from "./routes/authRoute.js";
import guestCartRouter from "./routes/guestCartRoute.js";
import recentlyViewedRouter from "./routes/recentlyViewedRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import ejsRouter from "./routes/ejsRoute.js";

import { requestTimer } from "./middleware/requestTimer.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

// 1. SECURITY HEADERS
app.use(helmet());

// 2. RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});
app.use("/api", limiter);

// 3. CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

// 4. COOKIE PARSER
app.use(cookieParser(process.env.COOKIE_SECRET || "clothify-cookie-secret"));

// 5. BODY PARSER
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// 6. SESSIONS
app.use(
  session({
    secret: process.env.SESSION_SECRET || "clothify-session-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 7 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// 7. PASSPORT
app.use(passport.initialize());

// 8. LOGGING
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// 9. REQUEST TIMER
app.use(requestTimer);

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    sessionID: req.sessionID,
    guestCart: req.session.guestCart || {},
  });
});

// SOCKET.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinOrder", (orderId) => {
    socket.join(`order:${orderId}`);
    console.log(`Socket ${socket.id} joined order:${orderId}`);
  });

  socket.on("joinAdmin", () => {
    socket.join("adminRoom");
    console.log(`Admin ${socket.id} joined adminRoom`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io };

// ROUTES
app.get("/", (req, res) => {
  res.send("Backend Working 🚀");
});

app.use("/api/cart", cartRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);
app.use("/api/admin", adminRouter);
app.use("/api/guest-cart", guestCartRouter);
app.use("/api/recently-viewed", recentlyViewedRouter);
app.use("/api/payment", paymentRouter);
app.use("/auth", authRouter);
app.use("/admin", ejsRouter);         // ← SSR admin pages (EJS)
app.use("/api/subscribe", subscribeRouter);

app.use("/api/reviews", reviewRouter);
app.use("/api/wishlist", wishlistRouter);

// 404 HANDLER
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// CENTRAL ERROR HANDLER
app.use(errorHandler);

// DATABASE + SERVER START
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected ✅");
    httpServer.listen(4000, () => {
      console.log("Server running on port 4000 🚀");
    });
  })
  .catch((err) => {
    console.log("DB ERROR:", err);
    process.exit(1);
  });