import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authUser = (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization;

    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Not logged in. Please login first."
      });
    }

    const finalToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    // ← store on req directly, not req.body
    // req.body is undefined for GET requests
    req.userId = decoded.id;

    // Keep this for backward compatibility with your existing controllers
    // that read from req.body.userId (POST routes)
    if (req.body) {
      req.body.userId = decoded.id;
    }

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again."
    });
  }
};

export default authUser;