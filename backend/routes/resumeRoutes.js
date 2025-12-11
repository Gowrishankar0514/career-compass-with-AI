import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// If you want login required:
// router.post("/analyze", authMiddleware, analyzeResume);

// If ATS can be used without login:
router.post("/analyze", analyzeResume);

export default router;
