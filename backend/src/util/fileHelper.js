// utils/fileHelper.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname trong ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Xóa file vật lý trên server
 * @param {string} filePath - Đường dẫn file (từ root project)
 * @returns {Promise<boolean>} true nếu xóa thành công
 */
const deleteFile = async (filePath) => {
  if (!filePath) return false;

  // Chuẩn hóa đường dẫn: /uploads/cv/abc123.pdf → đầy đủ từ root
  let fullPath = filePath;

  // Nếu đường dẫn bắt đầu bằng /uploads → nối với root project
  if (filePath.startsWith("/uploads") || filePath.startsWith("uploads")) {
    fullPath = path.join(__dirname, "..", filePath.replace(/^\/+/, ""));
  } else {
    fullPath = path.join(__dirname, "..", "public", filePath.replace(/^\/+/, ""));
  }

  try {
    // Kiểm tra file có tồn tại không
    await fs.promises.access(fullPath, fs.constants.F_OK);
    
    // Xóa file
    await fs.promises.unlink(fullPath);
    console.log(`Đã xóa file: ${fullPath}`);
    return true;
  } catch (error) {
    // Nếu file không tồn tại → không sao cả
    if (error.code === "ENOENT") {
      console.warn(`File không tồn tại (bỏ qua): ${fullPath}`);
      return true;
    }

    console.error(`Lỗi khi xóa file ${fullPath}:`, error.message);
    return false;
  }
};

/**
 * Xóa nhiều file cùng lúc
 * @param {string[]} filePaths 
 */
const deleteMultipleFiles = async (filePaths = []) => {
  const results = await Promise.all(
    filePaths.map(filePath => deleteFile(filePath))
  );
  return results.every(result => result === true);
};

/**
 * Làm sạch thư mục uploads (dùng khi test hoặc cron job)
 */
const clearUploadsFolder = async () => {
  const uploadsPath = path.join(__dirname, "..", "public", "uploads", "cv");
  try {
    const files = await fs.promises.readdir(uploadsPath);
    for (const file of files) {
      await fs.promises.unlink(path.join(uploadsPath, file));
    }
    console.log("Đã dọn sạch thư mục uploads/cv");
  } catch (error) {
    console.error("Lỗi dọn thư mục:", error);
  }
};

export { deleteFile, deleteMultipleFiles, clearUploadsFolder };