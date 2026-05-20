// src/controllers/NoteController.js
import Note from "../models/Note.js";
import mongoose from "mongoose";

class NoteController {
  // ==================== LẤY DANH SÁCH GHI CHÚ ====================
  static async getNotes(req, res) {
    try {
      const userId = req.user.id;

      const notes = await Note.find({
        userId,
        isDeleted: { $ne: true },
      })
        .sort({ isPinned: -1, createdAt: -1 })
        .lean();

      return res.json({
        success: true,
        count: notes.length,
        data: notes,
      });
    } catch (error) {
      console.error("LỖI getNotes:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách ghi chú",
      });
    }
  }

  // ==================== TẠO GHI CHÚ MỚI ====================
  static async createNote(req, res) {
    try {
      const userId = req.user.id;
      const {
        title,
        content,
        tags = [],
        isPinned = false,
        applicationId,
      } = req.body;

      if (!content?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Nội dung ghi chú không được để trống",
        });
      }

      const note = await Note.create({
        userId,
        title: title?.trim() || "",
        content: content.trim(),
        tags: Array.isArray(tags)
          ? tags.filter((tag) => tag && tag.toString().trim() !== "")
          : [],
        isPinned: !!isPinned,
        applicationId: applicationId || null,
      });

      return res.status(201).json({
        success: true,
        message: "Tạo ghi chú thành công",
        data: note,
      });
    } catch (error) {
      console.error("LỖI createNote:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi tạo ghi chú",
      });
    }
  }

  // ==================== CẬP NHẬT GHI CHÚ ====================
  static async updateNote(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { title, content, tags, isPinned } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID ghi chú không hợp lệ",
        });
      }

      // Kiểm tra có dữ liệu để cập nhật không
      if (!title && !content && tags === undefined && isPinned === undefined) {
        return res.status(400).json({
          success: false,
          message: "Không có dữ liệu nào để cập nhật",
        });
      }

      const updateData = {};

      if (title !== undefined) updateData.title = title?.trim() || "";
      if (content !== undefined) {
        if (!content?.trim()) {
          return res.status(400).json({
            success: false,
            message: "Nội dung ghi chú không được để trống",
          });
        }
        updateData.content = content.trim();
      }
      if (tags !== undefined) {
        updateData.tags = Array.isArray(tags)
          ? tags.filter((tag) => tag && tag.toString().trim() !== "")
          : [];
      }
      if (isPinned !== undefined) updateData.isPinned = !!isPinned;

      const note = await Note.findOneAndUpdate(
        {
          _id: id,
          userId,
          isDeleted: { $ne: true },
        },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy ghi chú hoặc bạn không có quyền chỉnh sửa",
        });
      }

      return res.json({
        success: true,
        message: "Cập nhật ghi chú thành công",
        data: note,
      });
    } catch (error) {
      console.error("LỖI updateNote:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi cập nhật ghi chú",
      });
    }
  }
  // ==================== XÓA GHI CHÚ (SOFT DELETE) ====================
  static async deleteNote(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID ghi chú không hợp lệ",
        });
      }

      const note = await Note.findOneAndUpdate(
        { _id: id, userId },
        { isDeleted: true },
        { new: true }
      );

      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy ghi chú",
        });
      }

      return res.json({
        success: true,
        message: "Xóa ghi chú thành công",
      });
    } catch (error) {
      console.error("LỖI deleteNote:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi xóa ghi chú",
      });
    }
  }

  // ==================== TOGGLE GHIM GHI CHÚ ====================
  static async togglePin(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID ghi chú không hợp lệ",
        });
      }

      const note = await Note.findOne({
        _id: id,
        userId,
        isDeleted: { $ne: true },
      });

      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy ghi chú",
        });
      }

      note.isPinned = !note.isPinned;
      await note.save();

      return res.json({
        success: true,
        message: note.isPinned ? "Đã ghim ghi chú" : "Đã bỏ ghim ghi chú",
        data: note,
      });
    } catch (error) {
      console.error("LỖI togglePin:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi thay đổi trạng thái ghim",
      });
    }
  }
}

export default NoteController;
