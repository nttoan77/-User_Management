import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../../../util/sendEmail.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

class UserController {
  // ==================== ĐĂNG KÝ NGƯỜI DÙNG  ====================
  static async register(req, res) {
    try {
      // console.log("=== ĐĂNG KÝ MỚI ===");
      // console.log("Dữ liệu nhận được:", req.body);

      const { email, phone, password, configPassword, name } = req.body;

      if (!email || !phone || !password || !configPassword) {
        return res
          .status(400)
          .json({ message: "Vui lòng điền đầy đủ thông tin" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Mật khẩu phải từ 6 ký tự trở lên" });
      }

      if (password !== configPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu nhập lại không khớp" });
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ" });
      }

      const cleanedPhone = phone.replace(/[^0-9+]/g, "");
      if (!/^(0|\+84)\d{9,10}$/.test(cleanedPhone)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
      }

      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { phone: cleanedPhone }],
      });

      if (existingUser) {
        const field =
          existingUser.email === normalizedEmail ? "Email" : "Số điện thoại";
        return res.status(400).json({ message: `${field} đã tồn tại` });
      }

      const user = new User({
        email: normalizedEmail,
        phone: cleanedPhone,
        password: password, // để pre-save tự hash
        name: name?.trim() || null,
      });

      await user.save();

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          tokenVersion: user.tokenVersion || 0,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        message: "Đăng ký thành công!",
        token,
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name || "Người dùng",
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          isProfileComplete: user.isProfileComplete,
        },
      });
    } catch (error) {
      console.error("LỖI ĐĂNG KÝ:", error);

      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
          message:
            field === "email" ? "Email đã tồn tại" : "Số điện thoại đã tồn tại",
        });
      }

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: Object.values(error.errors)[0].message,
        });
      }

      return res.status(500).json({ message: "Lỗi server" });
    }
  }
  static async completeProfile(req, res) {
    try {
      // console.log("══════════════════════════════════════");
      // console.log("BẮT ĐẦU HOÀN THIỆN HỒ SƠ");
      // console.log("User ID từ token:", req.user.id);
      // console.log("Dữ liệu nhận từ frontend:", req.body);
      // console.log(
      //   "File ảnh (nếu có):",
      //   req.file
      //     ? {
      //         originalname: req.file.originalname,
      //         filename: req.file.filename,
      //         size: req.file.size,
      //         mimetype: req.file.mimetype,
      //       }
      //     : "Không có ảnh"
      // );

      const { fullName, birthDay, gender, currentAddress } = req.body;

      // VALIDATE CHI TIẾT
      if (!fullName?.trim()) {
        // console.log("THIẾU: Họ và tên");
        return res.status(400).json({ message: "Vui lòng nhập họ tên" });
      }
      if (!birthDay) {
        // console.log("THIẾU: Ngày sinh");
        return res.status(400).json({ message: "Vui lòng chọn ngày sinh" });
      }
      if (!["male", "female", "other"].includes(gender)) {
        // console.log("Giới tính không hợp lệ:", gender);
        return res.status(400).json({ message: "Giới tính không hợp lệ" });
      }
      if (!currentAddress?.trim()) {
        // console.log("THIẾU: Địa chỉ hiện tại");
        return res.status(400).json({ message: "Vui lòng nhập địa chỉ" });
      }

      // console.log("Tất cả dữ liệu hợp lệ!");

      const updateData = {
        name: fullName.trim(),
        birthDay: new Date(birthDay),
        gender:
          gender?.toLowerCase() === "male"
            ? "male"
            : gender?.toLowerCase() === "female"
            ? "female"
            : "other",
        address: currentAddress.trim(),
        isProfileComplete: true,
      };

      // XỬ LÝ ẢNH – LOG CHI TIẾT
      if (req.file) {
        // console.log("BẮT ĐẦU xử lý ảnh mới...");

        const currentUser = await User.findById(req.user.id);
        // console.log("Ảnh hiện tại trong DB:", currentUser.avatar);

        if (
          currentUser.avatar &&
          !currentUser.avatar.includes("ui-avatars.com")
        ) {
          const oldPath = path.join(
            process.cwd(),
            "public",
            currentUser.avatar.replace(/^\//, "")
          );
          // console.log("Đường dẫn ảnh cũ:", oldPath);

          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            // console.log("ĐÃ XÓA ảnh cũ thành công!");
          } else {
            // console.log(
            //   "Ảnh cũ không tồn tại trên disk (có thể đã xóa trước đó)"
            // );
          }
        }

        updateData.avatar = `/uploads/avatars/${req.file.filename}`;
        // console.log("Đường dẫn ảnh mới sẽ lưu vào DB:", updateData.avatar);
      } else {
        // console.log("Không có ảnh mới → giữ nguyên avatar cũ");
      }

      // console.log("DỮ LIỆU SẼ CẬP NHẬT VÀO MONGODB:", updateData);

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        // console.log("KHÔNG TÌM THẤY USER ĐỂ CẬP NHẬT!");
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      // console.log(
      //   "CẬP NHẬT THÀNH CÔNG! isProfileComplete =",
      //   updatedUser.isProfileComplete
      // );

      // TẠO AVATAR ĐẸP
      const getAvatar = () => {
        if (
          updatedUser.avatar &&
          !updatedUser.avatar.includes("ui-avatars.com")
        ) {
          const url = `${process.env.BASE_URL || "http://localhost:8888"}${
            updatedUser.avatar
          }`;
          // console.log("Dùng ảnh thật:", url);
          return url;
        }
        const defaultUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          updatedUser.name
        )}&background=random&bold=true&rounded=true&size=128`;
        // console.log("Dùng ảnh mặc định từ tên:", defaultUrl);
        return defaultUrl;
      };

      const finalAvatar = getAvatar();

      // console.log("HOÀN THIỆN HỒ SƠ THÀNH CÔNG 100%!");
      // console.log("Trả về frontend user mới với avatar:", finalAvatar);
      // console.log("══════════════════════════════════════");

      return res.json({
        message: "Hoàn thiện hồ sơ thành công!",
        user: {
          id: updatedUser._id,
          userId: updatedUser.userId,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          avatar: finalAvatar,
          birthDay: updatedUser.birthDay?.toISOString().split("T")[0] || null,
          gender: updatedUser.gender,
          address: updatedUser.address,
          isProfileComplete: true,
        },
      });
    } catch (error) {
      // console.error("LỖI CHẾT NGƯỜI TRONG completeProfile:");
      // console.error("Tên lỗi:", error.name);
      // console.error("Message:", error.message);
      // console.error("Stack trace:", error.stack);
      // console.log("══════════════════════════════════════");
      return res
        .status(500)
        .json({ message: "Lỗi server khi hoàn thiện hồ sơ" });
    }
  }

  // =============================LẤY DANH SÁCH CV ĐÃ LƯU====================
  static async getMyCVs(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .select("cvs defaultCV")
        .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy user",
        });
      }

      return res.json({
        success: true,
        count: user.cvs.length,
        data: user.cvs.sort((a, b) => b.updatedAt - a.updatedAt),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi lấy danh sách CV",
      });
    }
  }

  // ==================== LẤY THÔNG TIN CÁ NHÂN (SAU KHI ĐĂNG NHẬP) ====================
  static async getProfile(req, res) {
    // console.log("══════════════════════════════════════");
    // console.log("GET PROFILE ĐƯỢC GỌI");
    // console.log("User ID từ token:", req.user.id);

    try {
      const userId = req.user.id;

      // console.log("Bắt đầu truy vấn User từ DB...");
      const user = await User.findById(userId)
        .select("-password -resetPasswordOTP -tokenVersion -__v")
        .lean();

      if (!user) {
        // console.log("KHÔNG TÌM THẤY USER với ID:", userId);
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng",
        });
      }

      // console.log("TÌM THẤY USER:", {
      //   _id: user._id,
      //   name: user.name,
      //   email: user.email,
      //   isProfileComplete: user.isProfileComplete,
      //   hasAvatar: !!user.avatar,
      //   rawAvatar: user.avatar
      // });

      // TẠO AVATAR ĐẸP NHƯ TOPCV
      const getAvatarUrl = () => {
        if (user.avatar && !user.avatar.includes("ui-avatars.com")) {
          const fullUrl = `${process.env.BASE_URL || "http://localhost:8888"}${
            user.avatar
          }`;
          // console.log("Dùng ảnh thật từ server:", fullUrl);
          return fullUrl;
        }
        const name = user.name || "User";
        const uiAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random&bold=true&rounded=true&size=128&font-size=0.5`;
        // console.log("Dùng ảnh mặc định ui-avatars:", uiAvatar);
        return uiAvatar;
      };

      const avatarUrl = getAvatarUrl();

      // Format ngày sinh
      let formattedBirthDay = null;
      if (user.birthDay) {
        formattedBirthDay = new Date(user.birthDay).toISOString().split("T")[0];
        // console.log("Ngày sinh đã format:", formattedBirthDay);
      } else {
        // console.log("User chưa có ngày sinh");
      }

      // Giới tính hiển thị tiếng Việt
      const displayGender = (() => {
        if (!user.gender) {
          // console.log("Giới tính: Chưa cập nhật");
          return "Chưa cập nhật";
        }
        const map = { male: "Nam", female: "Nữ", other: "Khác" };
        const result = map[user.gender] || "Khác";
        // console.log(`Giới tính DB: ${user.gender} → Hiển thị: ${result}`);
        return result;
      })();

      // Địa chỉ
      const fullAddress = user.address || "Chưa cập nhật";
      // console.log("Địa chỉ hiển thị:", fullAddress);

      // console.log("TRẢ VỀ FRONTEND THÀNH CÔNG!");
      // console.log("══════════════════════════════════════");

      return res.json({
        success: true,
        message: "Lấy thông tin cá nhân thành công",
        user: {
          id: user._id,
          userId: user.userId || null,
          name: user.name || "Chưa đặt tên",
          fullName: user.name || "",
          email: user.email,
          phone: user.phone || "Chưa cập nhật",
          avatar: avatarUrl,
          birthDay: formattedBirthDay,
          gender: user.gender || "other", // để backend xử lý logic
          genderDisplay: displayGender, // để frontend hiển thị tiếng Việt
          address: user.address || null,
          addressDisplay: fullAddress,
          isProfileComplete: !!user.isProfileComplete,
          role: user.role || "user",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error("LỖI CHẾT NGƯỜI TRONG getProfile:");
      console.error("Tên lỗi:", error.name);
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
      // console.log("══════════════════════════════════════");

      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thông tin cá nhân",
      });
    }
  }

  // ==================== CẬP NHẬT THÔNG TIN CÁ NHÂN + UPLOAD ẢNH ====================
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { fullName, birthDay, gender, currentAddress } = req.body;

      const updateData = {
        fullName: fullName?.trim() || undefined,
        birthDay: birthDay ? new Date(birthDay) : undefined,
        gender: ["male", "female", "other"].includes(gender) ? gender : "other",
        currentAddress: currentAddress?.trim() || undefined,
      };

      // XỬ LÝ UPLOAD ẢNH ĐẠI DIỆN
      if (req.file) {
        // Xóa ảnh cũ nếu có
        const user = await User.findById(userId);
        if (user.avatar) {
          const oldPath = path.join(process.cwd(), user.avatar);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        updateData.avatar = `/uploads/avatars/${req.file.filename}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");

      return res.json({
        message: "Cập nhật thông tin cá nhân thành công!",
        user: {
          id: updatedUser._id,
          userId: updatedUser.userId,
          name: updatedUser.name,
          fullName: updatedUser.fullName,
          avatar: updatedUser.avatar,
          birthDay: updatedUser.birthDay
            ? updatedUser.birthDay.toISOString().split("T")[0]
            : null,
          gender: updatedUser.gender,
          currentAddress: updatedUser.currentAddress,
          isProfileComplete: updatedUser.isProfileComplete,
        },
      });
    } catch (error) {
      console.error("Lỗi updateProfile:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật thông tin" });
    }
  }
  // ==================== ĐĂNG NHẬP ====================
  static async login(req, res) {
    try {
      // console.log("══════════════════════════════════════");
      // console.log("BẮT ĐẦU ĐĂNG NHẬP MỚI");
      // console.log("Thời gian:", new Date().toLocaleString("vi-VN"));
      // console.log("Dữ liệu nhận từ frontend:", req.body);

      const { identifier, password } = req.body;

      // 1. Kiểm tra đầu vào
      if (!identifier || !password) {
        // console.log("THIẾU dữ liệu: identifier hoặc password = null/undefined");
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ thông tin" });
      }

      const cleanedIdentifier = identifier.trim();
      // console.log("Identifier sau khi trim:", `"${cleanedIdentifier}"`);
      // console.log("Độ dài identifier:", cleanedIdentifier.length);

      // 2. Tách riêng tìm email và phone – AN TOÀN TUYỆT ĐỐI
      let user = null;

      // Bước 2.1: Tìm bằng email trước
      // console.log("B1 → Thử tìm bằng EMAIL...");
      user = await User.findOne({
        email: cleanedIdentifier.toLowerCase(),
      }).select("+password");

      if (user) {
        // console.log("TÌM THẤY USER BẰNG EMAIL!");
        // console.log("Email trong DB:", user.email);
        // console.log("Phone trong DB:", user.phone);
        // console.log("User ID:", user._id);
        // console.log("userId hiển thị:", user.userId);
      } else {
        // console.log("KHÔNG tìm thấy bằng email → thử bằng số điện thoại...");

        const cleanedPhone = cleanedIdentifier.replace(/[^0-9+]/g, "");
        // console.log("Số điện thoại sau khi làm sạch:", `"${cleanedPhone}"`);

        if (cleanedPhone.length >= 9) {
          user = await User.findOne({ phone: cleanedPhone }).select(
            "+password"
          );
          if (user) {
            // console.log("TÌM THẤY USER BẰNG SỐ ĐIỆN THOẠI!");
            // console.log("Phone trong DB:", user.phone);
            // console.log("Email trong DB:", user.email);
          } else {
            // console.log("CẢ EMAIL VÀ PHONE ĐỀU KHÔNG TÌM THẤY!");
          }
        } else {
          // console.log("Chuỗi nhập vào không phải số điện thoại hợp lệ → bỏ qua tìm phone");
        }
      }

      // 3. Kiểm tra user tồn tại
      if (!user) {
        // console.log("KẾT LUẬN: TÀI KHOẢN KHÔNG TỒN TẠI");
        // console.log("══════════════════════════════════════");
        return res.status(404).json({ message: "Tài khoản không tồn tại" });
      }

      // 4. So sánh mật khẩu
      // console.log("Bắt đầu so sánh mật khẩu...");
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        // console.log("MẬT KHẨU SAI!");
        // console.log(
        //   "Mật khẩu người dùng nhập (đã ẩn):",
        //   password ? "Có nhập" : "Không nhập"
        // );
        // console.log(
        //   "Hash trong DB (đầu 20 ký tự):",
        //   user.password.substring(0, 20) + "..."
        // );
        // console.log("══════════════════════════════════════");
        return res.status(400).json({ message: "Mật khẩu không đúng" });
      }

      // console.log("MẬT KHẨU ĐÚNG! Đăng nhập thành công");

      // 5. Tạo token
      const tokenPayload = {
        id: user._id,
        role: user.role,
        tokenVersion: user.tokenVersion || 0,
      };
      // console.log("Token payload:", tokenPayload);

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      // console.log(
      //   "Token đã tạo (20 ký tự đầu):",
      //   token.substring(0, 20) + "..."
      // );

      // 6. Trả về frontend
      const responseUser = {
        id: user._id,
        userId: user.userId,
        name: user.name || "Người dùng",
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isProfileComplete: user.isProfileComplete || false,
      };

      // console.log("Đăng nhập THÀNH CÔNG! Trả dữ liệu về frontend:");
      // console.log("→ Name:", responseUser.name);
      // console.log("→ Email:", responseUser.email);
      // console.log("→ Phone:", responseUser.phone);
      // console.log("→ isProfileComplete:", responseUser.isProfileComplete);
      // console.log("══════════════════════════════════════");

      return res.json({
        message: "Đăng nhập thành công!",
        token,
        user: responseUser,
      });
    } catch (error) {
      // console.error("LỖI SERVER TRONG QUÁ TRÌNH ĐĂNG NHẬP:");
      // console.error("Error name:", error.name);
      // console.error("Error message:", error.message);
      // console.error("Stack:", error.stack);
      // console.log("══════════════════════════════════════");
      return res.status(500).json({ message: "Lỗi server" });
    }
  }
  // ==================== XÁC THỰC OTP ====================
  static async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "Không tìm thấy người dùng." });

      const otpInfo = user.verifyAccountOTP;
      if (!otpInfo || otpInfo.code !== otp)
        return res.status(400).json({ message: "Mã OTP không chính xác." });

      if (new Date() > otpInfo.expiresAt) {
        user.verifyAccountOTP = undefined;
        await user.save();
        return res.status(400).json({ message: "Mã OTP đã hết hạn." });
      }

      user.verifyAccountOTP = undefined;
      user.isActive = true;
      await user.save();

      return res.status(200).json({ message: "Xác thực OTP thành công!" });
    } catch (error) {
      console.error("❌ Lỗi xác thực OTP:", error);
      return res.status(500).json({ message: "Lỗi server khi xác thực OTP." });
    }
  }

  // ==================== QUÊN MẬT KHẨU ====================

  static async forgetPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "Không tìm thấy người dùng." });

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // CHỈ UPDATE FIELD CẦN THIẾT → TRÁNH LỖI VALIDATION
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            "resetPasswordOTP.code": otpCode,
            "resetPasswordOTP.expiresAt": expiresAt,
            "resetPasswordOTP.verified": false,
          },
        }
      );

      await sendEmail(
        email,
        "Khôi phục mật khẩu",
        `Mã OTP của bạn là: ${otpCode}`
      );

      return res.json({ message: "Đã gửi mã OTP đến email của bạn!" });
    } catch (error) {
      console.error("Lỗi gửi OTP:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  // ==================== ĐỔI MẬT KHẨU ====================
  static async changePassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email }).select("+password");

      if (!user || !user.resetPasswordOTP?.code) {
        return res.status(400).json({ message: "Yêu cầu không hợp lệ." });
      }

      if (user.resetPasswordOTP.code !== otp) {
        return res.status(400).json({ message: "Mã OTP không đúng." });
      }
      if (new Date() > user.resetPasswordOTP.expiresAt) {
        return res.status(400).json({ message: "Mã OTP đã hết hạn." });
      }

      // Cập nhật mật khẩu + xóa OTP + tăng tokenVersion
      await User.updateOne(
        { _id: user._id },
        {
          $set: { password: newPassword }, // pre-save sẽ tự hash
          $unset: { resetPasswordOTP: "" },
          $inc: { tokenVersion: 1 },
        }
      );

      return res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  // ==================== LẤY THÔNG TIN NGƯỜI DÙNG ====================
  static async getUser(req, res) {
    try {
      const { userId } = req.params;

      // 🔹 Ép kiểu về Number để đảm bảo tìm đúng
      const user = await User.findOne({ userId: Number(userId) });

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng!" });
      }

      // 🔹 Hàm định dạng ngày sinh sang kiểu Việt Nam
      const formatDateVN = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const userObj = user.toObject();
      userObj.birthDay = formatDateVN(userObj.birthDay);

      res.status(200).json(userObj);
    } catch (error) {
      console.error("❌ Lỗi server getUser:", error);
      res
        .status(500)
        .json({ message: "Lỗi server khi lấy thông tin người dùng!!!" });
    }
  }

  // ==================== CẬP NHẬT THÔNG TIN NGƯỜI DÙNG ====================
  static async updateUserInfo(req, res) {
    try {
      const userId = req.body.userId;
      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại." });

      if (req.body.nameUser) user.nameUser = req.body.nameUser;
      if (req.body.phone) user.phone = req.body.phone;

      if (req.files) {
        if (req.files.avatar)
          user.avatar = `/uploads/${req.files.avatar[0].filename}`;
        if (req.files.attachments)
          user.attachments = req.files.attachments.map(
            (f) => `/uploads/${f.filename}`
          );
        if (req.files.certificates)
          user.certificates = req.files.certificates.map(
            (f) => `/uploads/${f.filename}`
          );
      }

      await user.save();
      return res
        .status(200)
        .json({ message: "Cập nhật thông tin thành công.", user });
    } catch (error) {
      console.error("❌ Lỗi cập nhật thông tin:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật thông tin." });
    }
  }

  // ==================== CẬP NHẬT ROLE ====================
  static async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const user = await User.findById(id);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại." });

      user.role = role;
      await user.save();
      return res
        .status(200)
        .json({ message: "Cập nhật role thành công.", user });
    } catch (error) {
      console.error("❌ Lỗi cập nhật role:", error);
      return res.status(500).json({ message: "Lỗi server khi cập nhật role." });
    }
  }

  // ==================== XÓA NGƯỜI DÙNG ====================
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại." });

      const filesToDelete = [];
      if (user.avatar)
        filesToDelete.push(path.join(process.cwd(), user.avatar));
      if (user.attachments?.length)
        user.attachments.forEach((f) =>
          filesToDelete.push(path.join(process.cwd(), f))
        );
      if (user.certificates?.length)
        user.certificates.forEach((f) =>
          filesToDelete.push(path.join(process.cwd(), f))
        );
      filesToDelete.forEach((f) => fs.existsSync(f) && fs.unlinkSync(f));

      return res.status(200).json({ message: "Xóa người dùng thành công." });
    } catch (error) {
      console.error("❌ Lỗi xóa người dùng:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server khi xóa người dùng." });
    }
  }
}

export default UserController;
