// models/User.js
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//   userId: { type: Number, unique: true, sparse: true },

//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//     index: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     index: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6,
//     select: false,
//   },

//   name: { type: String, trim: true, default: null },
//   avatar: {
//     type: String,
//     default:
//       "https://ui-avatars.com/api/?name=User&background=random&bold=true",
//   },
//   gender: {
//     type: String,
//     enum: ["male", "female", "other"],
//     default: "other",
//     lowercase: true,
//     trim: true,
//   },
//   birthDay: Date,
//   address: String,
//   bio: String,
//   jobTitle: String,
//   skills: { type: [String], default: [] },
//   experience: String,
//   education: String,

//   isProfileComplete: { type: Boolean, default: false },
//   role: { type: String, enum: ["user", "admin"], default: "user", index: true },

//   tokenVersion: { type: Number, default: 0 },
//   isActive: { type: Boolean, default: true },
//   isDeleted: {
//     type: Boolean,
//     default: false,
//     index: true,
//   },
//   deletedAt: {
//     type: Date,
//     default: null,
//   },
//   deletedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     default: null,
//   },

//   restoredAt: {
//     type: Date,
//     default: null,
//   },

//   restoredBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     default: null,
//   },
//   lastLoginAt: Date,

//   cvs: [
//     {
//       // cv: {
//       //   type: mongoose.Schema.Types.ObjectId,
//       //   ref: "CV",
//       //   required: true,
//       // },
//       title: {
//         type: String, // 👉 TÊN CV HIỂN THỊ
//         required: true,
//         trim: true,
//       },
//       isDefault: {
//         type: Boolean,
//         default: false,
//       },
//       updatedAt: {
//         type: Date,
//         default: Date.now,
//       },
//       cvId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "CV",
//         required: true,
//       },
//     },
//   ],

//   defaultCV: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "CV",
//   },

//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   otpCode: String,
//   otpExpires: Date,
//   isVerified: { type: Boolean, default: false },

//   createdAt: { type: Date, default: Date.now, index: true },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Cập nhật updatedAt
// userSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // CHỐNG HASH MẬT KHẨU 2 LẦN – SIÊU AN TOÀN
// userSchema.pre("save", async function (next) {
//   try {
//     // Chỉ hash khi:
//     // 1. password bị thay đổi
//     // 2. và password hiện tại KHÔNG phải là hash bcrypt (chưa bị hash hoặc là chuỗi thô)
//     if (
//       this.isModified("password") &&
//       this.password &&
//       !this.password.startsWith("$2b$") && // bcrypt hash luôn bắt đầu bằng $2b$
//       !this.password.startsWith("$2a$")
//     ) {
//       console.log("Đang hash mật khẩu mới (chỉ 1 lần duy nhất)...");
//       this.password = await bcrypt.hash(this.password, 10);
//     }

//     // Tạo userId đẹp
//     if (!this.userId) {
//       const lastUser = await this.constructor
//         .findOne({ userId: { $exists: true } })
//         .sort({ userId: -1 })
//         .select("userId")
//         .lean();

//       this.userId = lastUser && lastUser.userId ? lastUser.userId + 1 : 100000;
//     }

//     // Tạo tên tạm
//     if (!this.name && this.userId) {
//       this.name = `User${this.userId}`;
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Methods
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// userSchema.methods.incrementTokenVersion = function () {
//   this.tokenVersion += 1;
//   return this.save();
// };

// export default mongoose.model("User", userSchema);


// ============================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true, sparse: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  name: { type: String, trim: true, default: null },
  avatar: {
    type: String,
    default:
      "https://ui-avatars.com/api/?name=User&background=random&bold=true",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "other",
    lowercase: true,
    trim: true,
  },
  birthDay: Date,
  address: String,
  bio: String,
  jobTitle: String,
  skills: { type: [String], default: [] },
  experience: String,
  education: String,

  // === FIELD MỚI ĐƯỢC THÊM (tất cả có default để không ảnh hưởng code cũ) ===

  // 1. Bảo mật login (hỗ trợ lock account sau X lần sai)
  loginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },

  // 2. Theo dõi hoạt động (dùng cho thống kê retention, auto logout idle)
  lastActiveAt: { type: Date, default: null, index: true },

  // 3. Ai tạo user (hữu ích khi admin tạo thủ công)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // 4. Setting cá nhân của user (dễ mở rộng sau: theme, ngôn ngữ, thông báo...)
  preferences: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      language: "vi",
      theme: "light",
      emailNotifications: true,
      pushNotifications: true,
    },
  },

  // 5. Link mạng xã hội (profile đẹp hơn)
  socialLinks: {
    type: Map,
    of: String,
    default: new Map(),
  },

  // === FIELD CŨ GIỮ NGUYÊN ===
  isProfileComplete: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user", index: true },

  tokenVersion: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  restoredAt: { type: Date, default: null },
  restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  lastLoginAt: Date,

  cvs: [
    {
      title: { type: String, required: true, trim: true },
      isDefault: { type: Boolean, default: false },
      updatedAt: { type: Date, default: Date.now },
      cvId: { type: mongoose.Schema.Types.ObjectId, ref: "CV", required: true },
    },
  ],

  defaultCV: { type: mongoose.Schema.Types.ObjectId, ref: "CV" },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
  otpCode: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
});

// === INDEX THÊM (tăng tốc query, không ảnh hưởng code cũ) ===
userSchema.index({ email: 1, isDeleted: 1 });
userSchema.index({ phone: 1, isDeleted: 1 });
userSchema.index({ role: 1, isActive: 1, isDeleted: 1 });
userSchema.index({ "preferences.theme": 1 }); // nếu sau này lọc theo theme

// === VIRTUAL cvCount (tính số CV mà không cần query riêng, code cũ vẫn dùng cvs.length được) ===
userSchema.virtual("cvCount").get(function () {
  return this.cvs ? this.cvs.length : 0;
});

// Cập nhật updatedAt
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password chỉ 1 lần + tạo userId + tên mặc định (giữ nguyên logic cũ)
userSchema.pre("save", async function (next) {
  try {
    if (
      this.isModified("password") &&
      this.password &&
      !this.password.startsWith("$2b$") &&
      !this.password.startsWith("$2a$")
    ) {
      console.log("Đang hash mật khẩu mới...");
      this.password = await bcrypt.hash(this.password, 10);
    }

    if (!this.userId) {
      const lastUser = await this.constructor
        .findOne({ userId: { $exists: true } })
        .sort({ userId: -1 })
        .select("userId")
        .lean();

      this.userId = lastUser && lastUser.userId ? lastUser.userId + 1 : 100000;
    }

    if (!this.name && this.userId) {
      this.name = `User${this.userId}`;
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Methods giữ nguyên
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementTokenVersion = function () {
  this.tokenVersion += 1;
  return this.save();
};

// Để virtual xuất hiện trong JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", userSchema);
