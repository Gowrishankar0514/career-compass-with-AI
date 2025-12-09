// ------------------------------
// LOAD ENV FIRST (VERY IMPORTANT)
// ------------------------------
import dotenv from "dotenv";
dotenv.config();   // MUST be first line
// ------------------------------
// IMPORTS
// ------------------------------
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

// ------------------------------
// APP INIT
// ------------------------------
const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------
// MONGO CONNECTION
// ------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// ------------------------------
// ROUTES
// ------------------------------
app.use("/api/auth", authRoutes);      // Login + Register
app.use("/api/resumes", resumeRoutes); // Resume Analyzer / AI

// TEST ROUTE
app.get("/", (req, res) => {
  res.send({ msg: "Career Compass Backend Running ✔" });
});

// ------------------------------
// START SERVER
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


