import User from "../models/User.js";
import Setting from "../models/Setting.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

class AdminController {
  // 🟩 Lấy tất cả người dùng
  async getAllUsersAdmin(req, res) {
    try {
      const includeDeleted = req.query.includeDeleted === "true";

      let users;
      if (includeDeleted) {
        // Lấy tất cả (kể cả đã xóa)
        users = await User.find().sort({ createdAt: -1 }).select("-password");
      } else {
        // Chỉ lấy user chưa bị xóa mềm (xử lý an toàn nếu isDeleted undefined)
        users = await User.find({
          $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } }, // ← thêm điều kiện này
          ],
        })
          .sort({ createdAt: -1 })
          .select("-password");
      }

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({
        message: "Lỗi server khi lấy danh sách người dùng",
        error: err.message,
      });
    }
  }

  // 🟦 Tạo người dùng mới (Admin thêm user)
  // async createUser(req, res) {
  //   try {
  //     const { name, email, phone, workPosition } = req.body;

  //     const normalizedEmail = email.toLowerCase().trim();
  //     const cleanedPhone = phone.replace(/[^0-9+]/g, "");

  //     if (!email || !phone) {
  //       return res
  //         .status(400)
  //         .json({ message: "Thiếu email hoặc số điện thoại!" });
  //     }

  //     const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  //     if (existingUser) {
  //       return res.status(400).json({ message: "Email hoặc SĐT đã tồn tại!" });
  //     }

  //     const hashedPassword = await bcrypt.hash("123456", 10);

  //     const newUser = new User({
  //       name,
  //       email,
  //       phone,
  //       workPosition,
  //       password: hashedPassword,
  //       isProfileComplete: false,
  //       isDeleted: false,
  //     });

  //     await newUser.save();

  //     res.status(201).json({
  //       message: "Tạo người dùng thành công!",
  //       user: newUser,
  //     });
  //   } catch (error) {
  //     console.error("❌ [ERROR] createUser:", {
  //       message: error.message,
  //       name: error.name,
  //       stack: error.stack,
  //       code: error.code,
  //       errors: error.errors,
  //     });

  //     res.status(500).json({
  //       message: "Không thể thêm người dùng!",
  //       error: error.message,
  //     });
  //   }
  // }

  async createUser(req, res) {
    try {
      // console.log("══════════════════════════════════════");
      // console.log("🚀 ADMIN BẮT ĐẦU TẠO USER MỚI");
      // console.log("Thời gian:", new Date().toLocaleString("vi-VN"));

      const { name, email, phone, workPosition } = req.body;

      // console.log("⭐ Dữ liệu nhận từ frontend:", req.body);

      if (!email || !phone) {
        // console.log("❌ Thiếu email hoặc phone");
        return res
          .status(400)
          .json({ message: "Thiếu email hoặc số điện thoại!" });
      }

      // Chuẩn hóa dữ liệu
      const normalizedEmail = email.toLowerCase().trim();
      const cleanedPhone = phone.replace(/[^0-9+]/g, "");

      // console.log("⭐ Email sau khi chuẩn hóa:", normalizedEmail);
      // console.log("⭐ Phone sau khi làm sạch:", cleanedPhone);

      // Kiểm tra user trùng
      // console.log("🔎 Kiểm tra user đã tồn tại trong MongoDB...");

      const existingUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { phone: cleanedPhone }],
      });

      if (existingUser) {
        // console.log("⚠️ USER ĐÃ TỒN TẠI!");
        // console.log("ID:", existingUser._id);
        // console.log("Email:", existingUser.email);
        // console.log("Phone:", existingUser.phone);

        return res.status(400).json({ message: "Email hoặc SĐT đã tồn tại!" });
      }

      // console.log("✅ Không có user trùng → tiếp tục tạo");

      // Tạo password mặc định
      // console.log("🔐 Bắt đầu hash password mặc định...");

      const hashedPassword = await bcrypt.hash("123456", 10);

      // console.log(
      //   "⭐ Password hash (20 ký tự đầu):",
      //   hashedPassword.substring(0, 20) + "..."
      // );

      // Tạo user mới
      const newUser = new User({
        name: name?.trim() || null,
        email: normalizedEmail,
        phone: cleanedPhone,
        workPosition,
        password: hashedPassword,
        isProfileComplete: false,
        isDeleted: false,
      });

      // console.log("📦 Dữ liệu user chuẩn bị lưu:", {
      //   name: newUser.name,
      //   email: newUser.email,
      //   phone: newUser.phone,
      //   workPosition: newUser.workPosition,
      // });

      // Lưu vào MongoDB
      await newUser.save();

      // console.log("🎉 TẠO USER THÀNH CÔNG!");
      // console.log("User ID:", newUser._id);
      // console.log("══════════════════════════════════════");

      res.status(201).json({
        message: "Tạo người dùng thành công!",
        user: newUser,
      });
    } catch (error) {
      // console.error("❌ [ERROR] createUser:");
      // console.error("Tên lỗi:", error.name);
      // console.error("Message:", error.message);
      // console.error("Stack:", error.stack);
      // console.log("══════════════════════════════════════");

      res.status(500).json({
        message: "Không thể thêm người dùng!",
        error: error.message,
      });
    }
  }

  // 🟦 Thay đổi vai trò người dùng (chỉ Admin mới có quyền)
  async updateUserRole(req, res) {
    try {
      const { id } = req.params; // id của người cần đổi quyền
      const { role } = req.body; // vai trò mới: 'admin' hoặc 'user'

      // 🧩 Kiểm tra role hợp lệ
      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ message: "Vai trò không hợp lệ!" });
      }

      // 🧩 Không cho admin tự đổi quyền chính mình
      if (req.user.id === id) {
        return res
          .status(403)
          .json({ message: "Bạn không thể tự thay đổi quyền của chính mình!" });
      }

      // 🧩 Cập nhật role
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng!" });
      }

      res.status(200).json({
        message: `Đã cập nhật vai trò của ${updatedUser.nameUser} thành ${role}`,
        user: updatedUser,
      });
    } catch (error) {
      console.error("❌ [ERROR] updateUserRole:", error);
      res.status(500).json({ message: "Lỗi server khi cập nhật vai trò!" });
    }
  }

  // 🟨 Lấy 1 người dùng theo ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user)
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      res.status(200).json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy người dùng", error: err.message });
    }
  }

  // 🟧 Cập nhật thông tin người dùng
  async updateUser(req, res) {
    try {
      const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updated)
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      res.status(200).json({ message: "Cập nhật thành công", user: updated });
    } catch (err) {
      res.status(400).json({ message: "Lỗi khi cập nhật", error: err.message });
    }
  }

  // 🟥 Xóa người dùng
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID người dùng không hợp lệ" });
      }

      // Optional: chặn admin tự xóa chính mình
      if (req.user?._id?.toString() === id) {
        return res.status(400).json({
          message: "Bạn không thể tự xóa tài khoản của chính mình",
        });
      }

      const deletedUser = await User.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: req.user?._id || null,
          },
        },
        { new: true }
      ).select("-password");

      if (!deletedUser) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng hoặc người dùng đã bị xóa",
        });
      }

      return res.status(200).json({
        message: "Xóa mềm người dùng thành công",
        data: deletedUser,
      });
    } catch (error) {
      console.error("Soft delete user error:", error);
      return res.status(500).json({
        message: "Lỗi server khi xóa người dùng",
      });
    }
  }

  // 🟪 Khôi phục người dùng đã xóa mềm
  async restoreUser(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      const restoredUser = await User.findOneAndUpdate(
        { _id: id, isDeleted: true },
        {
          $set: {
            isDeleted: false,
            deletedAt: null,
            deletedBy: null,
            restoredAt: new Date(),
            restoredBy: req.user?._id || null,
          },
        },
        { new: true }
      ).select("-password");

      if (!restoredUser) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng đã bị xóa",
        });
      }

      return res.status(200).json({
        message: "Khôi phục người dùng thành công",
        data: restoredUser,
      });
    } catch (error) {
      console.error("Restore user error:", error);
      return res.status(500).json({
        message: "Lỗi server khi khôi phục người dùng",
      });
    }
  }
  // 🟥 Xóa vĩnh viễn
  async deleteUserPermanently(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      const deletedUser = await User.findOneAndDelete({ _id: id });

      if (!deletedUser) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng",
        });
      }

      // Optional: xóa các document liên quan
      // await CV.deleteMany({ user: id });

      return res.status(200).json({
        message: "Xóa vĩnh viễn người dùng thành công",
      });
    } catch (error) {
      console.error("Permanent delete error:", error);
      return res.status(500).json({
        message: "Lỗi server khi xóa vĩnh viễn",
      });
    }
  }

  async getDeletedUsers(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find({ isDeleted: true })
          .sort({ deletedAt: -1 })
          .skip(skip)
          .limit(limit)
          .select("-password -__v")
          .lean(),

        User.countDocuments({ isDeleted: true }),
      ]);

      return res.status(200).json({
        data: users,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      });
    } catch (error) {
      console.error("Get deleted users error:", error);
      return res.status(500).json({
        message: "Lỗi server khi lấy danh sách người dùng đã xóa",
      });
    }
  }

  // sử lý phần thống kê THỐNG KÊ

  async getUserStats(req, res) {
    try {
      // console.log("=== BẮT ĐẦU THỐNG KÊ NGƯỜI DÙNG ===");
      // console.log("Thời gian:", new Date().toLocaleString("vi-VN"));
      // console.log("User gọi API:", req.user?.email || "Không xác định");

      const now = new Date();

      // 1. Tổng số người dùng hiện tại (không tính deleted)
      // console.log("1. Đang tính tổng users...");
      const totalUsers = await User.countDocuments({
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      });
      // console.log("→ Tổng users:", totalUsers);

      // 2. Người dùng mới hôm nay
      // console.log("2. Đang tính newToday...");
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const newToday = await User.countDocuments({
        createdAt: { $gte: todayStart },
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      });
      // console.log("→ New today:", newToday);

      // 3. Người dùng mới tuần này (từ thứ 2 tuần hiện tại)
      // console.log("3. Đang tính newThisWeek...");
      const weekStart = new Date(now);
      const dayOfWeek = weekStart.getDay();
      weekStart.setDate(
        weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
      );
      weekStart.setHours(0, 0, 0, 0);
      const newThisWeek = await User.countDocuments({
        createdAt: { $gte: weekStart },
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      });
      // console.log("→ New this week:", newThisWeek);

      // 4. Người dùng mới tháng này
      // console.log("4. Đang tính newThisMonth...");
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const newThisMonth = await User.countDocuments({
        createdAt: { $gte: monthStart },
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      });
      // console.log("→ New this month:", newThisMonth);

      // 5. Tăng trưởng MoM (%)
      // console.log("5. Đang tính growthMoM...");
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      const newPrevMonth = await User.countDocuments({
        createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      });
      // console.log("→ New prev month:", newPrevMonth);

      const growthMoM =
        newPrevMonth === 0
          ? 0
          : ((newThisMonth - newPrevMonth) / newPrevMonth) * 100;
      // console.log("→ Growth MoM (%):", growthMoM.toFixed(1));

      // 6. Đăng ký theo ngày (30 ngày gần nhất)
      // console.log("6. Aggregation daily (30 ngày)...");
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      const dailyRegistrations = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", count: 1, _id: 0 } },
      ]);
      // console.log("→ Daily registrations:", dailyRegistrations.length, "ngày");

      // 7. Đăng ký theo tháng (12 tháng gần nhất)
      // console.log("7. Aggregation monthly (12 tháng)...");
      const twelveMonthsAgo = new Date(now);
      twelveMonthsAgo.setMonth(now.getMonth() - 12);
      const monthlyRegistrations = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: twelveMonthsAgo },
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { month: "$_id", count: 1, _id: 0 } },
      ]);
      // console.log(
      //   "→ Monthly registrations:",
      //   monthlyRegistrations.length,
      //   "tháng"
      // );

      // 8. Phân bố role
      // console.log("8. Aggregation role distribution...");
      const roleDistribution = await User.aggregate([
        {
          $match: {
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
          },
        },
        {
          $group: {
            _id: "$role",
            value: { $sum: 1 },
          },
        },
        {
          $project: {
            name: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id", "user"] }, then: "User" },
                  { case: { $eq: ["$_id", "admin"] }, then: "Admin" },
                  { case: { $eq: ["$_id", "moderator"] }, then: "Moderator" },
                ],
                default: "Khác",
              },
            },
            value: 1,
            _id: 0,
          },
        },
      ]);
      // console.log("→ Role distribution:", roleDistribution);

      // Trả về dữ liệu
      // console.log("=== THỐNG KÊ HOÀN TẤT ===");
      res.status(200).json({
        totalUsers,
        newToday,
        newThisWeek,
        newThisMonth,
        growthMoM: growthMoM.toFixed(1),
        dailyRegistrations,
        monthlyRegistrations,
        roleDistribution,
      });
    } catch (error) {
      console.error("!!! LỖI getUserStats:", error.message);
      console.error("Stack:", error.stack);
      res.status(500).json({
        message: "Lỗi server khi lấy thống kê người dùng",
        error: error.message,
      });
    }
  }

  // =============================================
  // 🟩 LẤY TOÀN BỘ CÀI ĐẶT HỆ THỐNG  CÀI ĐẶT
  // =============================================
  async getSettings(req, res) {
    try {
      // console.log("=== [SETTINGS] BẮT ĐẦU LẤY CÀI ĐẶT ===");
      // console.log("User gọi:", req.user?.email || "Không xác định");

      // Dùng findOneAndUpdate với upsert để tránh duplicate key
      let settings = await Setting.findOneAndUpdate(
        { _id: "global" }, // tìm theo _id = "global"
        {
          $setOnInsert: {
            // chỉ chạy khi tạo mới
            general: {},
            security: {},
            email: {},
            upload: {},
            notification: {},
            log: {},
            features: {},
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      // Ẩn mật khẩu SMTP trước khi trả về
      const safeSettings = settings.toObject();
      if (safeSettings.email?.smtpPass) {
        safeSettings.email.smtpPass = "••••••••";
      }

      // console.log("→ Lấy settings thành công");
      res.status(200).json(safeSettings);
    } catch (err) {
      console.error("❌ [ERROR] getSettings:", err.message);
      res.status(500).json({
        message: "Lỗi server khi lấy cài đặt hệ thống",
        error: err.message,
      });
    }
  }

  // =============================================
  // 🟦 CẬP NHẬT CÀI ĐẶT (Partial Update)
  // =============================================
  async updateSettings(req, res) {
    try {
      const settings = await Setting.findOneAndUpdate(
        { _id: "global" },
        { 
          $set: req.body,
          $set: { 
            updatedAt: new Date(),
            updatedBy: req.user._id 
          }
        },
        { upsert: true, new: true }
      );
  
      const safeResponse = settings.toObject();
      if (safeResponse.email?.smtpPass) {
        safeResponse.email.smtpPass = "••••••••";
      }
  
      res.status(200).json({
        message: "Cập nhật cài đặt hệ thống thành công!",
        settings: safeResponse,
      });
    } catch (err) {
      console.error("❌ [ERROR] updateSettings:", err);
      res.status(500).json({
        message: "Lỗi server khi cập nhật cài đặt hệ thống",
        error: err.message,
      });
    }
  }

  // =============================================
  // 🟥 RESET TOÀN BỘ CÀI ĐẶT VỀ MẶC ĐỊNH (Tùy chọn)
  // =============================================
  async resetSettings(req, res) {
    try {
      // console.log("=== [SETTINGS] RESET VỀ MẶC ĐỊNH ===");

      if (!req.user || req.user.role !== "superadmin") {
        return res.status(403).json({
          message: "Chỉ Super Admin mới được reset cài đặt hệ thống",
        });
      }

      const defaultSettings = new Setting({ _id: "global" });

      await Setting.findByIdAndUpdate("global", defaultSettings.toObject(), {
        upsert: true,
        new: true,
      });

      // console.log("→ ĐÃ RESET SETTINGS VỀ MẶC ĐỊNH");
      res.status(200).json({
        message: "Đã khôi phục cài đặt hệ thống về mặc định thành công",
        settings: defaultSettings,
      });
    } catch (err) {
      console.error("❌ [ERROR] resetSettings:", err.message);
      res.status(500).json({
        message: "Lỗi server khi reset cài đặt",
        error: err.message,
      });
    }
  }

  // =============================================
  // (Tùy chọn) Test gửi email SMTP
  // =============================================
  async testEmail(req, res) {
    try {
      // Bạn có thể tích hợp nodemailer sau
      // Hiện tại chỉ trả về thông báo để test kết nối
      res.status(200).json({
        message:
          "Chức năng test email đang được phát triển. Vui lòng cấu hình nodemailer.",
        status: "pending",
      });
    } catch (err) {
      res.status(500).json({ message: "Lỗi test email", error: err.message });
    }
  }
}

export default new AdminController();
