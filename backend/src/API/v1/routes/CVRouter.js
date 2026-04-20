// import express from "express";
// import path from "path";
// import fs from "fs";
// // import multer from "multer";

// import CvController from "../Controller/CvController.js";
// import protect from "../../v1/middleware/authMiddleware.js";
// import { uploadCVFiles } from "../../../middlewares/upload.js";

// const router = express.Router();

// /* =====================================================
//    1️⃣ CẤU HÌNH UPLOAD FILE (TÁCH RÕ – DỄ BẢO TRÌ)
  

// ===================================================== */
// router.use((req, res, next) => {
//   // console.log(`🧭 [CV ROUTER] ${req.method} ${req.originalUrl}`);
//   next();
// });

// // ✅ [SỬA] chuẩn hoá đường dẫn upload
// const uploadDir = path.join(process.cwd(), "public/uploads/cv");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // ✅ [SỬA] cấu hình storage
// // const storage = multer.diskStorage({
// //   destination: (_, __, cb) => cb(null, uploadDir),

// //   filename: (req, file, cb) => {
// //     const ext = path.extname(file.originalname);
// //     const uniqueName = `cv_${req.user._id}_${Date.now()}_${Math.round(
// //       Math.random() * 1e9
// //     )}${ext}`;

// //     cb(null, uniqueName);
// //   },
// // });

// // ✅ [SỬA] filter file rõ ràng
// // const fileFilter = (req, file, cb) => {
// //   const allowedMimeTypes = [
// //     "image/jpeg",
// //     "image/jpg",
// //     "image/png",
// //     "image/gif",
// //     "image/webp",
// //     "application/pdf",
// //     "application/msword",
// //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// //   ];

// //   if (!allowedMimeTypes.includes(file.mimetype)) {
// //     return cb(new Error("❌ File không hợp lệ"), false);
// //   }

// //   cb(null, true);
// // };

// // ✅ [SỬA] upload middleware dùng chung
// // const upload = multer({
// //   storage,
// //   fileFilter,
// //   limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
// // });

// // // ✅ [SỬA] tách middleware upload cho CV
// // const uploadCVFiles = upload.fields([
// //   { name: "certificateFiles", maxCount: 10 },
// //   { name: "attachments", maxCount: 5 },
// // ]);

// /* =====================================================
//    2️⃣ ROUTES – TUÂN THỦ REST API (KHÔNG TRÙNG PATH)
// ===================================================== */

// /**
//  * 📌 TẠO CV
//  * POST /api/cv
//  */
// router.post(
//   "/",
//   protect, // ✅ BẮT BUỘC trước upload
//   uploadCVFiles, // ✅ upload nhiều loại file
//   CvController.createCV
// );

// /**
//  * 📌 LẤY DANH SÁCH CV CỦA USER
//  * GET /api/cv
//  */
// router.get("/", protect, CvController.getMyCVs);

// /**
//  * 📌 LẤY CV MẶC ĐỊNH
//  * GET /api/cv/default
//  */
// router.get("/default", protect, CvController.getDefaultCV);

// /**
//  * 📌 LẤY DANH SÁCH THÙNG RÁC
//  * GET /api/cv/trash
//  */
// router.get("/trash", protect, CvController.getTrashCVs);

// /**
//  * lấy tên mà người dung tìm kiếm
//  * GET /api/cv/search-by-name
//  */
// router.get("/search-by-name", protect, CvController.searchMyCVs);

// /**
//  * 📌 XÓA MỀM CV (chuyển vào thùng rác)
//  * DELETE /api/cv/:id
//  */
// router.delete("/:id", protect, CvController.deleteCV);

// /**
//  * 📌 KHÔI PHỤC CV TỪ THÙNG RÁC
//  * PATCH /api/cv/:id/restore
//  */
// router.patch("/:id/restore", protect, CvController.restoreCV);

// /**
//  * 📌 XÓA VĨNH VIỄN CV (CHỈ TRONG THÙNG RÁC)
//  * DELETE /api/cv/:id/force
//  */
// router.delete("/:id/force", protect, CvController.forceDeleteCV);

// /**
//  * 📌 SET CV MẶC ĐỊNH
//  * PATCH /api/cv/:id/default
//  */
// router.patch("/:id/default", protect, CvController.setDefaultCV);

// /**
//  * 📌 LẤY CHI TIẾT 1 CV
//  * GET /api/cv/:id
//  */
// router.get("/:id", protect, CvController.getCVById);

// /**
//  * 📌 CẬP NHẬT CV
//  * PUT /api/cv/:id
//  */
// router.put(
//   "/:id",
//   protect,
//   uploadCVFiles, // ✅ dùng lại middleware
//   CvController.updateCV
// );

// /**
//  * 📌 LẤY LỊCH SỬ PHIÊN BẢN CỦA CV (để chữa dữ liệu)
//  * GET /api/cv/:id/history
//  */
// router.get("/:id/history", protect, CvController.getCVHistory);
// /**
//  * 📌 KHÔI PHỤC CV VỀ PHIÊN BẢN CŨ
//  * POST /api/cv/:id/restore-version/:version
//  * hoặc PATCH /api/cv/:id/versions/:version/restore
//  */
// router.post("/:id/restore-version/:version", protect, CvController.restoreCVVersion);
// // Hoặc dùng PATCH nếu thích idempotent hơn

// export default router;


// ========================================
import express from "express";
import path from "path";
import fs from "fs";
// import multer from "multer";

import CvController from "../Controller/CvController.js";
import protect from "../../v1/middleware/authMiddleware.js";
import { uploadCVFiles } from "../../../middlewares/upload.js";

const router = express.Router();

/* =====================================================
   1️⃣ CẤU HÌNH UPLOAD FILE (TÁCH RÕ – DỄ BẢO TRÌ)
===================================================== */
router.use((req, res, next) => {
  // console.log(`🧭 [CV ROUTER] ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ [SỬA] chuẩn hoá đường dẫn upload (giữ nguyên dù không dùng trực tiếp)
const uploadDir = path.join(process.cwd(), "public/uploads/cv");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Các phần comment multer cũ giữ nguyên, không xóa
// const storage = multer.diskStorage({ ...
// const fileFilter = ...
// const upload = ...
// const uploadCVFiles = ...

/* =====================================================
   2️⃣ ROUTES – TUÂN THỦ REST API (KHÔNG TRÙNG PATH)
===================================================== */

/**
 * 📌 TẠO CV
 * POST /api/cv
 */
router.post(
  "/",
  protect, // ✅ BẮT BUỘC trước upload để có req.user
  uploadCVFiles, // ✅ upload nhiều loại file
  CvController.createCV
);

/**
 * 📌 LẤY DANH SÁCH CV CỦA USER
 * GET /api/cv
 */
router.get("/", protect, CvController.getMyCVs);

/**
 * 📌 LẤY CV MẶC ĐỊNH
 * GET /api/cv/default
 */
router.get("/default", protect, CvController.getDefaultCV);

/**
 * 📌 LẤY DANH SÁCH THÙNG RÁC
 * GET /api/cv/trash
 */
router.get("/trash", protect, CvController.getTrashCVs);

/**
 * lấy tên mà người dung tìm kiếm
 * GET /api/cv/search-by-name
 */
router.get("/search-by-name", protect, CvController.searchMyCVs);

/**
 * 📌 XÓA MỀM CV (chuyển vào thùng rác)
 * DELETE /api/cv/:id
 */
router.delete("/:id", protect, CvController.deleteCV);

/**
 * 📌 KHÔI PHỤC CV TỪ THÙNG RÁC
 * PATCH /api/cv/:id/restore
 */
router.patch("/:id/restore", protect, CvController.restoreCV);

/**
 * 📌 XÓA VĨNH VIỄN CV (CHỈ TRONG THÙNG RÁC)
 * DELETE /api/cv/:id/force
 */
router.delete("/:id/force", protect, CvController.forceDeleteCV);

/**
 * 📌 SET CV MẶC ĐỊNH
 * PATCH /api/cv/:id/default
 */
router.patch("/:id/default", protect, CvController.setDefaultCV);

/**
 * 📌 LẤY CHI TIẾT 1 CV
 * GET /api/cv/:id
 */
router.get("/:id", protect, CvController.getCVById);

/**
 * 📌 CẬP NHẬT CV
 * PUT /api/cv/:id
 */
router.put(
  "/:id",
  protect,
  uploadCVFiles, // ✅ dùng lại middleware
  CvController.updateCV
);

/**
 * 📌 LẤY LỊCH SỬ PHIÊN BẢN CỦA CV (để chữa dữ liệu)
 * GET /api/cv/:id/history
 */
router.get("/:id/history", protect, CvController.getCVHistory);

/**
 * 📌 KHÔI PHỤC CV VỀ PHIÊN BẢN CŨ
 * POST /api/cv/:id/restore-version/:version
 */
router.post("/:id/restore-version/:version", protect, CvController.restoreCVVersion);

// ────────────────────────────────────────────────
// THÊM ERROR HANDLER RIÊNG CHO MULTER (không ảnh hưởng cấu trúc cũ)
// ────────────────────────────────────────────────
router.use((err, req, res, next) => {
  // Xử lý lỗi từ multer một cách thân thiện hơn
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: "File quá lớn (tối đa 20MB mỗi file)",
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: "Field file không đúng (chỉ chấp nhận certificateFiles hoặc attachments)",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || "Lỗi upload file",
    });
  }

  // Lỗi khác (ví dụ validation, db) → tiếp tục global handler
  next(err);
});

export default router;