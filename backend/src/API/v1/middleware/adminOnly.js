// src/middleware/adminOnly.js
import User from '../models/User.js';

// Middleware kiểm tra quyền admin
const adminOnly = async (req, res, next) => {
  // Giả sử bạn đã có middleware protect trước đó, req.user đã được gán từ JWT
  if (!req.user) {
    return res.status(401).json({ message: 'Không có quyền truy cập - chưa xác thực' });
  }

  try {
    // Tìm user từ DB để lấy role mới nhất (tránh trường hợp token cũ)
    const user = await User.findById(req.user.id).select('role');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền truy cập' });
    }

    // Nếu là admin → cho đi tiếp
    next();
  } catch (error) {
    console.error('Lỗi kiểm tra quyền admin:', error);
    res.status(500).json({ message: 'Lỗi server khi kiểm tra quyền' });
  }
};

export default adminOnly;