// src/routes/TrackSchedule.js
import express from "express";
import TrackScheduleController from "../Controller/TrackScheduleController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware log (tùy chọn)
router.use((req, res, next) => {
  // console.log(`[JOB] ${req.method} ${req.originalUrl}`);
  next();
});

/* ==================== ROUTES ==================== */

// Lấy tất cả job của user
router.get("/", protect, TrackScheduleController.getTrackSchedules);

// Tạo job mới
router.post("/", protect, TrackScheduleController.createTrackSchedule);

// Cập nhật job
router.put("/:id", protect, TrackScheduleController.updateTrackSchedule);

// Xóa job (soft delete)
router.delete("/:id", protect, TrackScheduleController.deleteTrackSchedule);

// Cập nhật trạng thái (dùng cho Kanban)
router.patch("/:id/status", protect, TrackScheduleController.updateStatus);

export default router;
