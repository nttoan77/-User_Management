import classNames from "classnames/bind";
import style from "./forget.module.scss";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const cx = classNames.bind(style);

function Forget() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // 🕒 Đếm ngược gửi lại OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 📤 Gửi OTP
  const handleSendOtp = async () => {
    if (!email) {
      setMessage("⚠️ Vui lòng nhập email!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Mã OTP đã được gửi đến email của bạn!");
        setOtpSent(true);
        setCountdown(60); // ⏱️ Bắt đầu đếm ngược 60s
      } else {
        setMessage(data.message || "❌ Gửi yêu cầu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi OTP:", error);
      setMessage("⚠️ Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xác minh OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("⚠️ Vui lòng nhập mã OTP!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ OTP hợp lệ! Đang chuyển hướng...");
        setTimeout(() => navigate("/resetPassword", { state: { email } }), 2000);
      } else {
        setMessage(data.message || "❌ Mã OTP không đúng hoặc đã hết hạn!");
      }
    } catch (error) {
      console.error("Lỗi khi xác minh OTP:", error);
      setMessage("⚠️ Đã xảy ra lỗi khi xác minh OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("forgot-container")}>
      <div className={cx("forgot-box")}>
        <h2 className={cx("title")}>Quên mật khẩu</h2>
        <p className={cx("subtitle")}>
          Nhập email để nhận mã OTP đặt lại mật khẩu.
        </p>

        {/* 📧 Form nhập email */}
        <div className={cx("form-wrapper", { blurred: otpSent })}>
          <div className={cx("form-group")}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              disabled={otpSent}
            />
          </div>

          <button
            type="button"
            className={cx("btn")}
            onClick={handleSendOtp}
            disabled={loading || countdown > 0}
          >
            {loading
              ? "Đang gửi..."
              : countdown > 0
              ? `Gửi lại OTP (${countdown}s)`
              : otpSent
              ? "Gửi lại OTP"
              : "Gửi yêu cầu"}
          </button>
        </div>

        {/* 🔢 Box nhập OTP */}
        {otpSent && (
          <form onSubmit={handleVerifyOtp} className={cx("otp-form")}>
            <div className={cx("form-group")}>
              <label>Nhập mã OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập 6 số OTP"
              />
            </div>
            <button type="submit" className={cx("btn-verify")} disabled={loading}>
              {loading ? "Đang kiểm tra..." : "Xác minh OTP"}
            </button>
          </form>
        )}

        {message && <p className={cx("message")}>{message}</p>}

        <div className={cx("back-login")}>
          <Link to="/login">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Forget;
