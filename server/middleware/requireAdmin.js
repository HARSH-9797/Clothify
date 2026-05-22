import userModel from "../models/userModel.js";

const requireAdmin = async (req, res, next) => {
  try {
    // Use req.userId instead of req.body.userId
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    next();

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default requireAdmin;