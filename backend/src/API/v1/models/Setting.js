import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  _id: { type: String, default: "global" },

  general: {
    siteName: { type: String, default: "Quản Lý CV Ấm" },
    siteDescription: { type: String, default: "" },
    primaryColor: { type: String, default: "#4f46e5" },
    logoUrl: { type: String, default: "" },
  },

  security: {
    require2FA: { type: Boolean, default: false },
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutMinutes: { type: Number, default: 15 },
    passwordMinLength: { type: Number, default: 8 },
  },

  email: {
    smtpHost: { type: String, default: "smtp.gmail.com" },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: "" },
    smtpPass: { type: String, default: "" },           // Nên encrypt sau này
    fromEmail: { type: String, default: "no-reply@amcv.vn" },
    fromName: { type: String, default: "Hệ thống CV Ấm" },
  },

  upload: {
    maxFileSizeMB: { type: Number, default: 10 },
    allowedExtensions: { type: String, default: ".pdf,.docx,.doc" },
    maxCVPerUser: { type: Number, default: 5 },
  },

  notification: {
    enableEmailNotification: { type: Boolean, default: true },
    enableNewCVAlert: { type: Boolean, default: true },
    adminEmailForAlert: { type: String, default: "admin@amcv.vn" },
  },

  log: {
    logLevel: { 
      type: String, 
      default: "info", 
      enum: ["debug", "info", "warn", "error"] 
    },
    logRetentionDays: { type: Number, default: 30 },
    autoCleanLog: { type: Boolean, default: true },
  },

  features: {
    enableCVBuilder: { type: Boolean, default: true },
    enableJobPosting: { type: Boolean, default: false },
    enableReferralSystem: { type: Boolean, default: true },
  },

  updatedAt: { type: Date, default: Date.now },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
}, { 
  timestamps: true 
});

export default mongoose.model("Setting", settingSchema);