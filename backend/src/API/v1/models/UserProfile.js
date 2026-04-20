// src/models/UserProfile.js
import mongoose from "mongoose";
import Counter from "./Counter.js";

const UserProfileSchema = new mongoose.Schema(
  {
    
    // THÔNG TIN CÁ NHÂN
    fullName: { type: String, trim: true },                   // Họ và tên đầy đủ
    avatar: { type: String, default: null },                  // Ảnh đại diện
    birthDay: { type: Date },                                  // Ngày tháng năm sinh
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    currentAddress: { type: String, trim: true },             // Nơi ở hiện tại

    // CÁC TRƯỜNG KHÁC
    username: { type: String, unique: true, sparse: true, trim: true },
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    resetPasswordOTP: {
      code: String,
      expiresAt: Date,
      verified: { type: Boolean, default: false },
    },

    isProfileComplete: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.resetPasswordOTP;
        delete ret.__v;
        delete ret.isDeleted;

        // Format ngày sinh đẹp
        if (ret.birthDay) {
          const d = new Date(ret.birthDay);
          ret.birthDay = d.toISOString().split("T")[0]; // YYYY-MM-DD
        }
        return ret;
      },
    },
  }
);

// ==================== PRE-SAVE HOOK ====================
UserProfileSchema.pre("save", async function (next) {
  const profile = this;

  // Tự động tạo userId nếu chưa có (nếu muốn dùng Counter giống User)
  if (profile.isNew && !profile.userId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: "userId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      profile.userId = counter.seq; // hoặc dùng ObjectId của User
    } catch (err) {
      return next(err);
    }
  }

  // Kiểm tra hoàn thiện profile
  const requiredProfileFields = [
    profile.fullName,
    profile.avatar,
    profile.birthDay,
    profile.gender && profile.gender !== "other",
    profile.currentAddress,
  ];
  profile.isProfileComplete = requiredProfileFields.slice(0, 5).every(
    field => field && field.toString().trim() !== ""
  );

  next();
});

// ==================== METHODS ====================
UserProfileSchema.methods.markProfileComplete = function () {
  this.isProfileComplete = true;
  return this.save();
};

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
export default UserProfile;
