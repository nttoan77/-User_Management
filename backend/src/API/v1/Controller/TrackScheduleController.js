// src/controllers/TrackScheduleController.js
import TrackSchedule from "../models/TrackSchedule.js";
import mongoose from "mongoose";

class TrackScheduleController {
  // ==================== LẤY DANH SÁCH ====================
  static async getTrackSchedules(req, res) {
    try {
      const userId = req.user.id;

      const trackSchedules = await TrackSchedule.find({
        userId,
        isDeleted: false,
      }).sort({ appliedDate: -1 });

      res.json({
        success: true,
        count: trackSchedules.length,
        data: trackSchedules,
      });
    } catch (error) {
      console.error("Lỗi getTrackSchedules:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách lịch trình",
      });
    }
  }

  // ==================== TẠO MỚI ====================
  static async createTrackSchedule(req, res) {
    try {
      const userId = req.user.id;
      const { companyName, position, ...rest } = req.body;

      if (!companyName || !position) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập tên công ty và vị trí",
        });
      }

      const newTrackSchedule = await TrackSchedule.create({
        userId,
        companyName: companyName.trim(),
        position: position.trim(),
        ...rest,
      });

      res.status(201).json({
        success: true,
        message: "Thêm lịch trình ứng tuyển thành công",
        data: newTrackSchedule,
      });
    } catch (error) {
      console.error("Lỗi createTrackSchedule:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi tạo lịch trình",
      });
    }
  }

  // ==================== CẬP NHẬT ====================
  static async updateTrackSchedule(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID không hợp lệ",
        });
      }

      const updatedTrackSchedule = await TrackSchedule.findOneAndUpdate(
        { _id: id, userId, isDeleted: false },
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedTrackSchedule) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy lịch trình",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật lịch trình thành công",
        data: updatedTrackSchedule,
      });
    } catch (error) {
      console.error("Lỗi updateTrackSchedule:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi cập nhật",
      });
    }
  }

  // ==================== XÓA (SOFT DELETE) ====================
  static async deleteTrackSchedule(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID không hợp lệ",
        });
      }

      const deletedTrackSchedule = await TrackSchedule.findOneAndUpdate(
        { _id: id, userId },
        { isDeleted: true },
        { new: true }
      );

      if (!deletedTrackSchedule) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy lịch trình",
        });
      }

      res.json({
        success: true,
        message: "Đã xóa lịch trình thành công",
      });
    } catch (error) {
      console.error("Lỗi deleteTrackSchedule:", error);
      res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }

  // ==================== CẬP NHẬT TRẠNG THÁI ====================
  static async updateStatus(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID không hợp lệ",
        });
      }

      const updated = await TrackSchedule.findOneAndUpdate(
        { _id: id, userId, isDeleted: false },
        { status },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy lịch trình",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật trạng thái thành công",
        data: updated,
      });
    } catch (error) {
      console.error("Lỗi updateStatus:", error);
      res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }
}

export default TrackScheduleController;
