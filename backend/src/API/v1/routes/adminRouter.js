import express from "express";
import AdminController from "../Controller/AdminController.js";
import { requireAdmin } from "../middleware/authMiddleware.js"; // ← sửa: chỉ import cái cần dùng
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

// ================================================
//  BẢO VỆ TOÀN BỘ ROUTE ADMIN – KHÔNG CHO USER THƯỜNG VÀO
// ================================================
router.use(authMiddleware); // ← verify token & gán req.user TRƯỚC
router.use(requireAdmin); // ← kiểm tra role admin SAU
// ================================================
//  1. DANH SÁCH & TÌM KIẾM NGƯỜI DÙNG
// ================================================
// SETTINGS
// GET    /api/admin/users/settings
router.get("/settings", AdminController.getSettings);
// PATCH    /api/admin/users/settings
router.patch("/settings", AdminController.updateSettings);
// POST   /api/admin/users/settings/reset
router.post("/settings/reset", AdminController.resetSettings);
// POST   /api/admin/users/test-email
router.post("/settings/test-email", AdminController.testEmail); // tùy chọn

// GET /api/admin/users              → danh sách (hỗ trợ page, limit, search, filter...)
// GET /api/admin/users/deleted      → danh sách đã xóa mềm
router.get("/", AdminController.getAllUsersAdmin);
router.get("/deleted", AdminController.getDeletedUsers);

// GET /api/admin/users/stats/users   ->Thống kê người dùng
router.get(
  "/stats/users",
  requireAdmin,
  adminOnly,
  AdminController.getUserStats
);

// ================================================
//  2. CHI TIẾT & CRUD CƠ BẢN
// ================================================
// GET    /api/admin/users/:id
// POST   /api/admin/users
// PATCH  /api/admin/users/:id       ← sửa: dùng PATCH thay PUT (update partial)
router.get("/:id", AdminController.getUserById);
router.post("/", AdminController.createUser);
router.patch("/:id", AdminController.updateUser); // ← ★★★ sửa: PUT → PATCH (chuẩn REST hơn)

// ================================================
//  3. XÓA & KHÔI PHỤC
// ================================================
// DELETE /api/admin/users/:id               → soft delete
// PATCH  /api/admin/users/:id/restore       → khôi phục
// DELETE /api/admin/users/:id/permanent     → xóa vĩnh viễn
router.delete("/:id", AdminController.deleteUser);
router.patch("/:id/restore", AdminController.restoreUser);
router.delete("/:id/permanent", AdminController.deleteUserPermanently);

// ================================================
//  4. PHÂN QUYỀN & TRẠNG THÁI
// ================================================
// PATCH /api/admin/users/:id/role           → đổi vai trò
// (nếu sau này thêm) PATCH /api/admin/users/:id/status → khóa/mở tài khoản
router.patch("/:id/role", AdminController.updateUserRole);

// ================================================
//  (Tùy chọn sau này – chưa có trong controller hiện tại)
// ================================================
// router.patch("/:id/status", AdminController.toggleUserStatus);   // khóa / mở tài khoản
// router.post("/bulk", AdminController.bulkAction);               // xóa/khóa nhiều user

export default router;
