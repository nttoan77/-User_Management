// src/API/v1/routes/authRoutes.js (hoặc routes.js)
import express from "express";
import UserController from "../Controller/Controller.js";
import authMiddleware, {
  requireAdmin,
} from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../../../middlewares/uploadAvatar.js";
import protect from "../../v1/middleware/authMiddleware.js";


const router = express.Router();

/* ====================== PUBLIC ROUTES ====================== */
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/verify-otp", UserController.verifyOtp);
router.post("/forgot", UserController.forgetPassword);
router.post("/reset-password", UserController.changePassword);

/* ====================== PROTECTED ROUTES ====================== */

// Hoàn thiện hồ sơ lần đầu (có upload avatar)
router.post(
  "/complete-profile",
  authMiddleware,
  uploadAvatar.single("avatar"),
  UserController.completeProfile
);

// Cập nhật thông tin sau này (có thể đổi avatar + file đính kèm)
router.put(
  "/update",
  authMiddleware,
  uploadAvatar.fields([
    { name: "avatar", maxCount: 1 },
    { name: "attachments", maxCount: 10 }, // ← SỬA DÒNG NÀY!
    { name: "certificates", maxCount: 10 }, // ← VÀ DÒNG NÀY!
  ]),
  UserController.updateUserInfo
);
router.get("/getCV",protect, UserController.getMyCVs);

router.get("/profile", authMiddleware, UserController.getProfile);
router.get("/user/:userId", UserController.getUser);

/* ====================== ADMIN ROUTES ====================== */
router.put(
  "/:id/role",
  authMiddleware,
  requireAdmin,
  UserController.updateUserRole
);
router.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  UserController.deleteUser
);

export default router;
