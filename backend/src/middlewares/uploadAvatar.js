// src/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Tạo thư mục public/uploads/avatars nếu chưa có
const avatarDir = path.join(process.cwd(), "public", "uploads", "avatars");
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
  console.log("Đã tạo thư mục lưu avatar:", avatarDir);
}

// Cấu hình lưu avatar
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `avatar_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh: PNG, JPG, JPEG, WebP"), false);
  }
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});