// src/pages/ResetPassword.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import style from "./resetPassword.module.scss";

const cx = classNames.bind(style);

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Lấy email từ trang Forget gửi sang

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!email) {
      setMessage("⚠️ Thiếu thông tin email. Vui lòng quay lại bước trước!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Mật khẩu đã được đặt lại thành công!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.message || "❌ Đặt lại mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API reset:", error);
      setMessage("⚠️ Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("reset-container")}>
      <div className={cx("reset-box")}>
        <h2 className={cx("title")}>Đặt lại mật khẩu</h2>
        <p className={cx("subtitle")}>Nhập mật khẩu mới cho tài khoản của bạn.</p>

        <form onSubmit={handleSubmit} className={cx("form")}>
          <div className={cx("form-group")}>
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div className={cx("form-group")}>
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          <button type="submit" className={cx("btn")} disabled={loading}>
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </form>

        {message && <p className={cx("message")}>{message}</p>}

        <div className={cx("back-login")}>
          <Link to="/login">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
