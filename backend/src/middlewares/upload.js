// src/middleware/upload.js
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // ==================== GIỮ NGUYÊN ====================
// const cvUploadDir = path.join(process.cwd(), "public", "uploads", "cv");

// // Tạo folder nếu chưa có
// if (!fs.existsSync(cvUploadDir)) {
//   fs.mkdirSync(cvUploadDir, { recursive: true });
// }

// // ==================== STORAGE ====================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, cvUploadDir);
//   },

//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);

//     // ==================== 🔧 SỬA 1: prefix RÕ RÀNG ====================
//     const prefix =
//       file.fieldname === "certificateFiles"
//         ? "certificate"
//         : file.fieldname === "attachments"
//         ? "attachment"
//         : "cv";

//     const filename = `${prefix}_${req.user._id}_${uniqueSuffix}${ext}`;
//     cb(null, filename);
//   },
// });

// // ==================== FILE FILTER ====================
// const fileFilter = (req, file, cb) => {
//   // 🔧 SỬA 2: log debug (test xong có thể xoá)
//   // console.log("📦 UPLOAD FILE:", file.fieldname, file.originalname);

//   const allowedTypes = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/gif",
//     "image/webp",
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     "application/vnd.ms-excel",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("❌ Chỉ chấp nhận ảnh, PDF, Word, Excel"), false);
//   }
// };

// // ==================== 🔥 FIX QUAN TRỌNG NHẤT ====================
// export const uploadCVFiles = multer({
//   storage,
//   limits: {
//     fileSize: 20 * 1024 * 1024, // 20MB
//   },
//   fileFilter,
// }).fields([
//   // 🔧 SỬA 3: GIỮ certificateFiles
//   { name: "certificateFiles", maxCount: 20 },

//   // 🔧 SỬA 4: THÊM attachments (TRƯỚC BẠN THIẾU)
//   { name: "attachments", maxCount: 10 },
// ]);

// src/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// ────────────────────────────────────────────────
// Config chung cho uploads
// ────────────────────────────────────────────────
const getUploadDir = (subDir) => {
  const dir = path.join(process.cwd(), "public", "uploads", subDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// ────────────────────────────────────────────────
// Storage cho CV files (certificate + attachment)
// ────────────────────────────────────────────────
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadDir("cv"));
  },

  filename: (req, file, cb) => {
    // Bảo vệ an toàn nếu chưa auth
    const userId = req.user?._id ? req.user._id.toString() : "anonymous";

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();

    let prefix = "file";
    if (file.fieldname === "certificateFiles") prefix = "certificate";
    if (file.fieldname === "attachments") prefix = "attachment";

    const filename = `${prefix}_${userId}_${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// ────────────────────────────────────────────────
// Filter
// ────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// ────────────────────────────────────────────────
// Export multer instance cho CV
// ────────────────────────────────────────────────
export const uploadCVFiles = multer({
  storage: cvStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter,
}).fields([
  { name: "certificateFiles", maxCount: 20 },
  { name: "attachments", maxCount: 10 },
  // Nếu frontend có thể gửi thêm field khác, thêm vào đây
]);

// ────────────────────────────────────────────────
// Nếu cần middleware riêng cho avatar (khuyến nghị)
// ────────────────────────────────────────────────
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadDir("avatars"));
  },
  filename: (req, file, cb) => {
    const userId = req.user?._id ? req.user._id.toString() : "anonymous";
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `avatar_${userId}_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cho avatar
  fileFilter,
}).single("avatar");
