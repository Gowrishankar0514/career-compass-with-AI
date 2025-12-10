import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 If you want only logged-in users to use ATS:
// router.post("/analyze", authMiddleware, analyzeResume);

// 🔥 If you want ATS to work without login:
router.post("/analyze", analyzeResume);

export default router;
