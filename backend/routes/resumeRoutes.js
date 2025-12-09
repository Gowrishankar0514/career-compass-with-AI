import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze", analyzeResume);

export default router;   // ✔ VERY IMPORTANT
