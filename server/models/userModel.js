import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  cartData: {
    type: Object,
    default: {}
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  // For Google OAuth — stores Google's user ID
  // null for normal email/password users
  googleId: {
    type: String,
    default: null
  }
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;