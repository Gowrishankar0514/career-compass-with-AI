import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ----------------------------------------
// REGISTER USER (DEMO MODE)
// ----------------------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ❌ REMOVED "user already exists" check

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.json({
      success: true,
      msg: "User registered successfully",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      msg: "Server error",
    });
  }
};

// ----------------------------------------
// LOGIN USER (LATEST ACCOUNT)
// ----------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Get latest user with that email
    const user = await User.findOne({ email }).sort({ createdAt: -1 });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "demo_secret",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      msg: "Login successful",
      token,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      msg: "Server error",
    });
  }
};
