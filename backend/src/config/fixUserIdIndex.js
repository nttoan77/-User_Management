
import mongoose from "mongoose";
import User from "../API/v1/models/User.js";

const fixUserIdIndex = async () => {
  try {
    // console.log("Đang kiểm tra và sửa index userId...");

    const collectionName = "users";
    const db = mongoose.connection.db;

    // Lấy danh sách tất cả index hiện tại
    const indexes = await db.collection(collectionName).indexes();

    // Tìm index cũ tên userId_1 mà KHÔNG có sparse: true
    const oldIndex = indexes.find(
      (idx) =>
        idx.key && idx.key.userId && idx.name === "userId_1" && !idx.sparse
    );

    if (oldIndex) {
      console.log("Phát hiện index userId_1 cũ → đang xóa...");
      await db.collection(collectionName).dropIndex("userId_1");
      console.log("Đã xóa index userId_1 cũ!");
    } else {
    //   console.log("Không tìm thấy index cũ hoặc đã có sparse: true → bỏ qua");
    }

    // Buộc Mongoose tạo lại index mới từ model (có sparse: true)
    await User.syncIndexes();
    // console.log("Đã tạo lại index userId mới với sparse: true");

    // console.log("SỬA INDEX userId THÀNH CÔNG – BẠN KHÔNG CẦN MỞ COMPASS NỮA!");
  } catch (error) {
    console.error("Lỗi khi sửa index userId:", error.message);
  }
};

export default fixUserIdIndex;