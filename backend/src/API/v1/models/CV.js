import mongoose from "mongoose";

const CVSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
      index: true,
    },

    title: {
      type: String,
      required: [true, "Tiêu đề CV là bắt buộc"],
      trim: true,
      maxlength: [100, "Tiêu đề không được quá 100 ký tự"],
    },

    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ================= THÔNG TIN CHÍNH =================
    nameCV: String,
    jobPosition: String,
    careerField: String,
    careerGoal: String,
    about: String,
    website: String,

    // ================= KINH NGHIỆM =================
    workExperiences: [
      {
        company: { type: String, },
        position: { type: String, },
        startDate: { type: Date, },
        endDate: Date,
        isCurrent: { type: Boolean, default: false },
        description: String,
        achievements: [String],
      },
    ],

    // ================= HỌC VẤN =================
    education: [
      {
        school: { type: String, },
        degree: String,
        fieldOfStudy: String,
        startDate: { type: Date, },
        endDate: Date,
        description: String,
        subjects: [String],
        achievements: [String],
      },
    ],

    // ================= KỸ NĂNG =================
    skills: {
      type: [
        {
          _id: false,
          name: { type: String,  trim: true },
          description: { type: String, trim: true, default: "" },
          category: {
            type: String,
            enum: ["hard", "soft"],
            default: "hard",
          },
          level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced", "expert"],
            default: "intermediate",
          },
        },
      ],
      default: [],
    },

    // ================= CHỨNG CHỈ =================
    certificates: [
      {
        _id: false,
        name: { type: String, },
        organization: String,
        issueDate: Date,
        expiryDate: Date,
        credentialId: String,
        credentialUrl: String,
        file: {
          filename: String,
          path: String,
          mimetype: String,
          size: Number,
        },
      },
    ],

    // ================= FILE ĐÍNH KÈM =================
    attachments: [
      {
        filename: { type: String, },
        path: { type: String, },
        mimetype: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // ================= FILE EXPORT =================
    exportedFiles: [
      {
        filename: { type: String, },
        path: { type: String, },
        mimetype: {
          type: String,
          enum: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
          
        },
        size: Number,
        exportedAt: { type: Date, default: Date.now },
      },
    ],

    // ================= GIAO DIỆN =================
    templateId: {
      type: String,
      default: "classic",
      enum: ["classic", "modern", "creative", "minimal"],
    },
    themeColor: {
      type: String,
      default: "#1976d2",
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },

    // ================= THÙNG RÁC =================
    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // ⭐ ADD: giúp query nhanh CV thường & thùng rác
    },
    deletedAt: {
      type: Date,
      default: null,
    },

    // update data 
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastUpdatedReason: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: "cvs",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== INDEX ====================
CVSchema.index({ user: 1, createdAt: -1 });
CVSchema.index({ user: 1, isDefault: 1 });
CVSchema.index({ user: 1, title: "text" });

// ⭐ ADD: index chuyên cho trang THÙNG RÁC
CVSchema.index({ user: 1, isDeleted: 1, deletedAt: -1 });

// ⭐ Giữ nguyên: chỉ 1 CV mặc định / user
CVSchema.index(
  { user: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);

// ==================== MIDDLEWARE ====================

// ⭐ FIX: Không cho CV trong thùng rác làm CV mặc định
CVSchema.pre("save", function (next) {
  if (this.isDeleted && this.isDefault) {
    this.isDefault = false;
  }
  next();
});

// ⭐ GIỮ NGUYÊN LOGIC CŨ: chỉ 1 CV default
CVSchema.pre("save", async function (next) {
  if (this.isNew && this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, isDefault: true },
      { isDefault: false }
    );
  } else if (this.isModified("isDefault") && this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id }, isDefault: true },
      { isDefault: false }
    );
  }
  next();
});

const CV = mongoose.model("CV", CVSchema);
export default CV;
