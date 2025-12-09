import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ----------------------------------------
// REGISTER USER
// ----------------------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.json({
      success: true,
      msg: "User registered successfully",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ----------------------------------------
// LOGIN USER
// ----------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      msg: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};
