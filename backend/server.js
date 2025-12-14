// ------------------------------
// LOAD ENV FIRST
// ------------------------------
import dotenv from "dotenv";
dotenv.config();

// ------------------------------
// IMPORTS
// ------------------------------
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

// ------------------------------
// APP INIT
// ------------------------------
const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json({ limit: "20mb" }));

// ------------------------------
// MONGO CONNECTION
// ------------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✔ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ------------------------------
// ROUTES
// ------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Career Compass Backend Running ✔" });
});

// ------------------------------
// START SERVER
// ------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


