// src/routes/note.routes.js
import express from "express";
import NoteController from "../Controller/NoteController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   NOTE ROUTES
===================================================== */

router.use((req, res, next) => {
  // console.log(`🧭 [NOTE ROUTER] ${req.method} ${req.originalUrl}`);
  next();
});

// ==================== CÁC ROUTE CHÍNH ====================

/**
 * 📌 LẤY DANH SÁCH GHI CHÚ
 * GET /api/notes
 */
router.get("/", protect, NoteController.getNotes);

/**
 * 📌 TẠO GHI CHÚ MỚI
 * POST /api/notes
 */
router.post("/", protect, NoteController.createNote);

/**
 * 📌 CẬP NHẬT GHI CHÚ
 * PUT /api/notes/:id
 */
router.put("/:id", protect, NoteController.updateNote);

/**
 * 📌 XÓA GHI CHÚ
 * DELETE /api/notes/:id
 */
router.delete("/:id", protect, NoteController.deleteNote);

/**
 * 📌 TOGGLE GHIM GHI CHÚ
 * PATCH /api/notes/:id/toggle-pin
 */
router.patch("/:id/toggle-pin", protect, NoteController.togglePin);

export default router;
