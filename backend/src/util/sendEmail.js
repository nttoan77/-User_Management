// src/util/sendEmail.js  ← ĐÃ SỬA HOÀN HẢO 2025
import nodemailer from "nodemailer";

// Không cần dotenv ở đây nếu bạn đã gọi dotenv.config() ở index.js
// import dotenv from "dotenv";
// dotenv.config();

const sendEmail = async (to, subject, text, html = null) => {
  try {
    // 1. DÙNG BIẾN MÔI TRƯỜNG CHUẨN (không bị sai tên)
    const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      throw new Error("Thiếu GMAIL_USER hoặc GMAIL_APP_PASSWORD trong .env");
    }

    // 2. TỐI ƯU CẤU HÌNH GMAIL (dùng port 465 + SSL là ổn định nhất)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true cho port 465
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD, // PHẢI LÀ APP PASSWORD 16 KÝ TỰ
      },
      // Thêm timeout để tránh treo khi Gmail block
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000,
    });

    // 3. HTML ĐẸP HƠN + HIỂN THỊ OTP TO RÕ
    const defaultHtml = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 30px; background:#f9f9f9; border-radius:10px;">
        <h2 style="color: #1a73e8; text-align:center;">${subject}</h2>
        <div style="background:#fff; padding:30px; border-radius:8px; text-align:center; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
          <p style="font-size:16px; color:#333;">Mã OTP của bạn là:</p>
          <h1 style="font-size:48px; letter-spacing:8px; color:#d32f2f; margin:20px 0;">
            ${text.match(/\d{6}/)?.[0] || "------"}
          </h1>
          <p style="color:#666; font-size:14px;">Mã này sẽ hết hạn sau <strong>5 phút</strong>.</p>
        </div>
        <p style="text-align:center; color:#888; margin-top:30px; font-size:12px;">
          © 2025 TopCV System. Tất cả quyền được bảo lưu.
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"TopCV System" <${GMAIL_USER}>`,
      to,
      subject,
      text, // fallback cho email client cũ
      html: html || defaultHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Email đã gửi thành công tới ${to} | MessageId: ${info.messageId}`
    );

    return info; // trả về để controller có thể dùng nếu cần
  } catch (error) {
    // 4. LOG RÕ LỖI ĐỂ DỄ DEBUG
    if (error.code === "EENVELOPE" && error.responseCode === 550) {
      console.error("GMAIL BỊ BLOCK – ĐÃ VƯỢT QUOTA HOẶC APP PASSWORD SAI!");
      console.error("→ Đang dùng email:", process.env.GMAIL_USER);
    }

    console.error("Lỗi gửi email:", error.message || error);
    throw new Error("Không thể gửi email. Vui lòng thử lại sau.");
  }
};

export default sendEmail;
