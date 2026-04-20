import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// 🧩 Xác thực token
export default async function authMiddleware(req, res, next) {
  try {
    // ================= LOG CƠ BẢN =================
    // console.log(`🔐 [AUTH] ${req.method} ${req.originalUrl}`);

    const authHeader = req.headers.authorization;

    // ================= CHECK HEADER =================
    if (!authHeader) {
      // console.log("⛔ [AUTH] Thiếu Authorization header");
      return res.status(401).json({
        success: false,
        message: "Bạn chưa đăng nhập",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      // console.log("⛔ [AUTH] Sai định dạng Authorization header");
      return res.status(401).json({
        success: false,
        message: "Token không đúng định dạng",
      });
    }

    const token = authHeader.split(" ")[1];

    // console.log("🔑 [AUTH] Token:", token.slice(0, 12) + "...");

    // ================= VERIFY TOKEN =================
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
      // console.log('[AUTH] Token verify thành công! Payload:', decoded);
    } catch (err) {
      // console.log("⛔ [AUTH] Token không hợp lệ / hết hạn");
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    // ================= GET USER =================
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      // console.log("⛔ [AUTH] User không tồn tại:", decoded.id);
      return res.status(401).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // ================= ATTACH USER =================
    req.user = user;

    // console.log("✅ [AUTH] Xác thực thành công | User:", user._id.toString());

    next();
  } catch (error) {
    console.error("🔥 [AUTH] Lỗi không mong muốn:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực",
    });
  }
}
//
// export default async function authMiddleware(req, res, next) {
//   try {
//     // ================= LOG CƠ BẢN =================
//     // console.log(`🔐 [AUTH] ${req.method} ${req.originalUrl}`);

//     const authHeader = req.headers.authorization;

//     // ================= CHECK HEADER =================
//     if (!authHeader) {
//       // console.log("⛔ [AUTH] Thiếu Authorization header");
//       return res.status(401).json({
//         success: false,
//         message: "Bạn chưa đăng nhập",
//       });
//     }

//     if (!authHeader.startsWith("Bearer ")) {
//       // console.log("⛔ [AUTH] Sai định dạng Authorization header");
//       return res.status(401).json({
//         success: false,
//         message: "Token không đúng định dạng",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     // console.log("🔑 [AUTH] Token:", token.slice(0, 12) + "...");

//     // ================= VERIFY TOKEN =================
//     // Trong authMiddleware, phần VERIFY TOKEN
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey"); // fallback nếu env thiếu
//       console.log(
//         "[AUTH] Token verify thành công! Payload:",
//         JSON.stringify(decoded, null, 2)
//       );
//       // Lấy user từ DB
//       const user = await User.findById(decoded.id).select("-password");
//       if (!user) {
//         console.log("[AUTH] User không tồn tại:", decoded.id);
//         return res
//           .status(401)
//           .json({ success: false, message: "Người dùng không tồn tại" });
//       }
//       req.user = user;
//       console.log("[AUTH] Xác thực thành công | User ID:", user._id.toString());
//       next();
//     } catch (err) {
//       console.error("[AUTH VERIFY ERROR]", {
//         name: err.name, // JsonWebTokenError, TokenExpiredError, ...
//         message: err.message, // "invalid signature", "jwt expired", "jwt malformed"
//         expiredAt: err.expiredAt,
//         tokenStart: token.slice(0, 20) + "...",
//       });
//       return res.status(401).json({
//         success: false,
//         message: "Token không hợp lệ hoặc đã hết hạn",
//       });
//     }

//     // ================= GET USER =================
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       // console.log("⛔ [AUTH] User không tồn tại:", decoded.id);
//       return res.status(401).json({
//         success: false,
//         message: "Người dùng không tồn tại",
//       });
//     }

//     // ================= ATTACH USER =================
//     req.user = user;

//     // console.log("✅ [AUTH] Xác thực thành công | User:", user._id.toString());

//     next();
//   } catch (error) {
//     console.error("🔥 [AUTH] Lỗi không mong muốn:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Lỗi xác thực",
//     });
//   }
// }

// 🧩 Kiểm tra quyền admin
export const requireAdmin = async (req, res, next) => {
  // Log để debug: xem req.user có giá trị gì
  // console.log(
  //   "[ADMIN] req.user hiện tại:",
  //   req.user ? JSON.stringify(req.user, null, 2) : "undefined"
  // );

  // Kiểm tra req.user tồn tại
  if (!req.user) {
    // console.log("[ADMIN] req.user undefined → reject 401");
    return res.status(401).json({
      success: false,
      message: "Chưa xác thực. Vui lòng đăng nhập lại. (middleware)",
    });
  }

  // Cách 1: Ưu tiên dùng thông tin từ token (nhanh, khuyến nghị)
  if (req.user.role === "admin") {
    // console.log("[ADMIN] Role admin OK từ token → cho qua");
    return next();
  }

  // Cách 2: Kiểm tra lại từ DB nếu cần (giữ nguyên logic của bạn)
  try {
    const user = await User.findById(req.user.id).select(
      "role isActive isDeleted"
    );

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản không tồn tại hoặc đã bị xóa",
      });
    }

    if (user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đã bị xóa",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đang bị khóa",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập khu vực này",
      });
    }

    // Cập nhật req.user nếu cần
    req.user.role = user.role;
    req.user.isActive = user.isActive;

    next();
  } catch (err) {
    console.error("[ADMIN_MIDDLEWARE_ERROR]", {
      userId: req.user?.id,
      error: err.message,
      stack: err.stack?.substring(0, 300),
    });

    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi kiểm tra quyền admin",
    });
  }
};
