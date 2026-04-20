// src/API/v1/Controller/CvController.js
import CV from "../models/CV.js";
import CVHistory from "../models/CVHistory.js";
import fs from "fs";
import path from "path";
import User from "../models/User.js";
import mongoose from "mongoose";
import { uploadCVFiles } from "../../../middlewares/upload.js";
import { deleteFile } from "../../../util/fileHelper.js";

class CvController {
  // Tạo CV mới
  // static async createCV(req, res) {
  //   // console.log("CREATE CV ĐƯỢC GỌI");
  //   // console.log("User ID từ token:", req.user._id);
  //   // console.log("Full req.body:", req.body);
  //   // console.log("req.files:", req.files);

  //   try {
  //     const userId = req.user._id;

  //     // ==================== VALIDATE ====================
  //     if (!req.body.title?.trim()) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Tiêu đề CV là bắt buộc",
  //       });
  //     }

  //     // ==================== BUILD DATA ====================
  //     const cvData = {
  //       user: userId,
  //       title: req.body.title.trim(),
  //       jobPosition: req.body.jobPosition?.trim() || "",
  //       nameCV: req.body.nameCV?.trim() || "",
  //       careerField: req.body.careerField?.trim() || "",
  //       careerGoal: req.body.careerGoal?.trim() || "",
  //       about: req.body.about?.trim() || "",
  //       website: req.body.website?.trim() || "",
  //       workExperiences: [],
  //       education: [],
  //       skills: [],
  //       certificates: [],
  //       attachments: [],
  //       exportedFiles: [],
  //     };

  //     // ==================== PARSE JSON ====================
  //     try {
  //       if (req.body.workExperiences) {
  //         cvData.workExperiences = JSON.parse(req.body.workExperiences);
  //       }
  //       if (req.body.education) {
  //         cvData.education = JSON.parse(req.body.education);
  //       }
  //       if (req.body.skills) {
  //         cvData.skills = JSON.parse(req.body.skills);
  //       }
  //       if (req.body.certificates) {
  //         cvData.certificates = JSON.parse(req.body.certificates);
  //       }
  //     } catch (err) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Dữ liệu JSON không hợp lệ",
  //       });
  //     }

  //     // =====================================================
  //     // 🔥🔥🔥 LOGIC QUAN TRỌNG NHẤT: MAP FILE → CERTIFICATES
  //     // =====================================================
  //     if (req.files?.certificateFiles?.length) {
  //       req.files.certificateFiles.forEach((file, index) => {
  //         if (cvData.certificates[index]) {
  //           cvData.certificates[index].file = {
  //             filename: file.filename, // 🔧 FIX
  //             path: file.path.replace(/\\/g, "/"), // 🔧 FIX
  //             mimetype: file.mimetype,
  //             size: file.size,
  //           };
  //         }
  //       });
  //     }

  //     // =====================================================
  //     // ❌ KHÔNG DÙNG attachments cho certificates nữa
  //     // (Nếu sau này có file khác thì xử lý riêng)
  //     // =====================================================

  //     // ==================== SET DEFAULT CV ====================
  //     const cvCount = await CV.countDocuments({ user: userId });
  //     if (cvCount === 0) {
  //       cvData.isDefault = true;
  //     }

  //     // ==================== SAVE CV ====================
  //     const newCV = new CV(cvData);
  //     await newCV.save();
  //     console.log("✅ CV mới được tạo với ID:", newCV._id.toString());

  //     // ==================== UPDATE USER ====================
  //     await User.findByIdAndUpdate(
  //       userId,
  //       {
  //         $push: {
  //           cvs: {
  //             cv: newCV._id,
  //             title: newCV.title,
  //             isDefault: newCV.isDefault,
  //             updatedAt: newCV.updatedAt,
  //           },
  //         },
  //         ...(newCV.isDefault && { defaultCV: newCV._id }),
  //       },
  //       { new: true }
  //     );

  //     // ==================== RESPONSE ====================
  //     return res.status(201).json({
  //       success: true,
  //       message: "Tạo CV thành công!",
  //       data: newCV,
  //     });
  //   } catch (error) {
  //     // console.error("LỖI createCV:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Lỗi tạo CV",
  //       error: error.message,
  //     });
  //   }
  // }

  // static async createCV(req, res) {
  //   try {
  //     const userId = req.user._id;

  //     // ==================== LOG TOÀN BỘ REQ ====================
  //     console.log("🚀 [CREATE CV] User ID:", userId);
  //     console.log("📥 [CREATE CV] req.body keys:", Object.keys(req.body));
  //     console.log(
  //       "📄 [CREATE CV] req.body.certificates (raw):",
  //       req.body.certificates
  //     );
  //     console.log(
  //       "🗂️ [CREATE CV] req.files:",
  //       req.files
  //         ? Object.keys(req.files).map(
  //             (key) => `${key}: ${req.files[key]?.length || 0} files`
  //           )
  //         : "No files"
  //     );

  //     // Nếu có certificateFiles
  //     if (req.files?.certificateFiles?.length) {
  //       console.log(
  //         "📸 [CREATE CV] certificateFiles count:",
  //         req.files.certificateFiles.length
  //       );
  //       req.files.certificateFiles.forEach((file, idx) => {
  //         console.log(`   File ${idx}:`, {
  //           originalname: file.originalname,
  //           filename: file.filename,
  //           path: file.path,
  //           mimetype: file.mimetype,
  //           size: file.size,
  //         });
  //       });
  //     }

  //     // ==================== VALIDATE ====================
  //     if (!req.body.title?.trim()) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Tiêu đề CV là bắt buộc",
  //       });
  //     }

  //     // ==================== BUILD DATA ====================
  //     const cvData = {
  //       user: userId,
  //       title: req.body.title.trim(),
  //       jobPosition: req.body.jobPosition?.trim() || "",
  //       nameCV: req.body.nameCV?.trim() || "",
  //       careerField: req.body.careerField?.trim() || "",
  //       careerGoal: req.body.careerGoal?.trim() || "",
  //       about: req.body.about?.trim() || "",
  //       website: req.body.website?.trim() || "",
  //       workExperiences: [],
  //       education: [],
  //       skills: [],
  //       certificates: [],
  //       attachments: [],
  //       exportedFiles: [],
  //     };

  //     // ==================== PARSE JSON ====================
  //     let certificates = [];

  //     if (req.body.certificates) {
  //       try {
  //         certificates = JSON.parse(req.body.certificates);
  //         console.log("✅ [CREATE CV] Parsed certificates JSON:", certificates);
  //         console.log("   Certificates count from JSON:", certificates.length);
  //       } catch (err) {
  //         console.error(
  //           "❌ [CREATE CV] JSON.parse certificates failed:",
  //           err.message
  //         );
  //         return res.status(400).json({
  //           success: false,
  //           message: "Dữ liệu JSON certificates không hợp lệ",
  //         });
  //       }
  //     } else {
  //       console.log("⚠️ [CREATE CV] No certificates JSON in req.body");
  //     }

  //     // ==================== GẮN FILE VÀO CERTIFICATES ====================
  //     if (req.files?.certificateFiles?.length) {
  //       console.log("🔗 [CREATE CV] Starting to map files to certificates...");

  //       req.files.certificateFiles.forEach((file, index) => {
  //         // Đảm bảo có phần tử tại index
  //         if (!certificates[index]) {
  //           console.log(`   Tạo mới certificate[${index}] vì chưa tồn tại`);
  //           certificates[index] = { name: "Chứng chỉ" };
  //         }

  //         certificates[index].file = {
  //           filename: file.filename,
  //           path: file.path.replace(/\\/g, "/"),
  //           mimetype: file.mimetype,
  //           size: file.size,
  //         };

  //         console.log(
  //           `   Đã gắn file vào certificate[${index}]:`,
  //           certificates[index].file.filename
  //         );
  //       });
  //     } else {
  //       console.log("⚠️ [CREATE CV] Không có certificateFiles nào được upload");
  //     }

  //     // Log cuối cùng trước khi lưu
  //     console.log("💾 [CREATE CV] Final certificates trước khi lưu DB:");
  //     certificates.forEach((cert, idx) => {
  //       console.log(`   Certificate ${idx}:`, {
  //         name: cert.name,
  //         hasFile: !!cert.file,
  //         fileInfo: cert.file
  //           ? {
  //               filename: cert.file.filename,
  //               path: cert.file.path,
  //               mimetype: cert.file.mimetype,
  //               size: cert.file.size,
  //             }
  //           : "No file",
  //       });
  //     });

  //     cvData.certificates = certificates;

  //     // ... phần lưu DB tiếp theo (create new CV)

  //     // Sau khi lưu thành công, log thêm nếu cần
  //     const newCV = await CV.create(cvData);
  //     console.log("🎉 CV created with ID:", newCV._id);

  //     // res.status(201).json({ ... });
  //   } catch (error) {
  //     console.error("💥 [CREATE CV] Lỗi server:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Lỗi server",
  //     });
  //   }
  // }
  /* =====================================================
     🔧 NORMALIZE CERTIFICATES
  ===================================================== */
  static normalizeCertificates(raw = []) {
    // console.log("🧪 [CERT] normalize input:", raw);

    if (!Array.isArray(raw)) return [];

    return raw.map((c, index) => {
      const normalized = {
        name: c.name?.trim() || `Chứng chỉ ${index + 1}`,
        organization: c.organization?.trim() || "",
        issueDate: c.issueDate ? new Date(c.issueDate) : null,
        expiryDate: c.expiryDate ? new Date(c.expiryDate) : null,
        credentialId: c.credentialId?.trim() || "",
        credentialUrl: c.credentialUrl?.trim() || "",
        file: null,
      };

      // console.log(`ℹ️ [CERT] normalized[${index}]`, normalized);
      return normalized;
    });
  }

  /* =====================================================
     📌 CREATE CV
  ===================================================== */
  // static async createCV(req, res) {
  //   try {
  //     /* ================= AUTH ================= */
  //     if (!req.user?._id) {
  //       return res.status(401).json({
  //         success: false,
  //         message: "Unauthorized",
  //       });
  //     }

  //     /* ================= VALIDATE ================= */
  //     if (!req.body.title?.trim()) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Tiêu đề CV là bắt buộc",
  //       });
  //     }

  //     /* ================= PARSE CERTIFICATES ================= */
  //     let certificates = [];

  //     if (req.body.certificates) {
  //       try {
  //         certificates = CvController.normalizeCertificates(
  //           JSON.parse(req.body.certificates)
  //         );
  //       } catch (err) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Certificates JSON không hợp lệ",
  //         });
  //       }
  //     }

  //     /* ================= MAP CERTIFICATE FILES ================= */
  //     // if (req.files?.certificateFiles?.length) {
  //     //   req.files.certificateFiles.forEach((file, index) => {
  //     //     if (!certificates[index]) return;

  //     //     certificates[index].file = {
  //     //       filename: file.filename,
  //     //       path: file.path.replace(/\\/g, "/"),
  //     //       mimetype: file.mimetype,
  //     //       size: file.size,
  //     //     };
  //     //   });
  //     // }

  //     if (req.files?.certificateFiles?.length) {
  //       req.files.certificateFiles.forEach((file, index) => {
  //         if (!certificates[index]) return;

  //         // Tính relative path từ public/ trở đi
  //         const relativePath = path
  //           .join("uploads", "cv", file.filename)
  //           .replace(/\\/g, "/");

  //         certificates[index].file = {
  //           filename: file.filename,
  //           path: `/${relativePath}`, // → /uploads/cv/ten-file.jpg
  //           // hoặc path: relativePath,                    // → uploads/cv/ten-file.jpg (nếu không muốn dấu / đầu)
  //           mimetype: file.mimetype,
  //           size: file.size,
  //         };

  //         // console.log(
  //         //   `[CREATE CV] Đã gán path mới cho cert ${index}: ${certificates[index].file.path}`
  //         // );
  //       });
  //     }

  //     /* =====================================================
  //        🔧 FIX 1: PARSE CÁC MẢNG JSON KHÁC (TRƯỚC ĐÂY BỊ THIẾU)
  //        ===================================================== */
  //     let workExperiences = [];
  //     let education = [];
  //     let skills = [];

  //     try {
  //       if (req.body.workExperiences) {
  //         workExperiences = JSON.parse(req.body.workExperiences);
  //       }

  //       if (req.body.education) {
  //         education = JSON.parse(req.body.education);
  //       }

  //       if (req.body.skills) {
  //         skills = JSON.parse(req.body.skills);
  //       }
  //     } catch (err) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Dữ liệu work/education/skills không hợp lệ",
  //       });
  //     }

  //     /* =====================================================
  //        🔧 FIX 2: PARSE isDefault AN TOÀN HƠN (KHÔNG PHÁ CŨ)
  //        ===================================================== */
  //     const isDefault =
  //       req.body.isDefault === true ||
  //       req.body.isDefault === "true" ||
  //       req.body.isDefault === "1";

  //     /* ================= CREATE PAYLOAD ================= */
  //     const cvPayload = {
  //       user: req.user._id,
  //       title: req.body.title.trim(),
  //       isDefault, // 🔧 FIX (thay thế dòng cũ)

  //       nameCV: req.body.nameCV || "",
  //       jobPosition: req.body.jobPosition || "",
  //       careerField: req.body.careerField || "",
  //       careerGoal: req.body.careerGoal || "",
  //       about: req.body.about || "",
  //       website: req.body.website || "",

  //       // 🔧 FIX 3: GÁN CÁC FIELD TRƯỚC ĐÂY CHƯA LƯU
  //       workExperiences,
  //       education,
  //       skills,

  //       certificates,
  //     };

  //     const cv = await CV.create(cvPayload);

  //     return res.status(201).json({
  //       success: true,
  //       message: "Tạo CV thành công",
  //       data: cv,
  //     });
  //   } catch (err) {
  //     return res.status(500).json({
  //       success: false,
  //       message: "Server error",
  //     });
  //   }
  // }


static async createCV(req, res) {
  try {
    /* ================= AUTH ================= */
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* ================= VALIDATE ================= */
    if (!req.body.title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tiêu đề CV là bắt buộc",
      });
    }

    /* ================= PARSE CERTIFICATES ================= */
    let certificates = [];

    if (req.body.certificates) {
      try {
        certificates = CvController.normalizeCertificates(
          JSON.parse(req.body.certificates)
        );
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Certificates JSON không hợp lệ",
        });
      }
    }

    /* ================= MAP CERTIFICATE FILES ================= */
    if (req.files?.certificateFiles?.length) {
      req.files.certificateFiles.forEach((file, index) => {
        if (!certificates[index]) return;

        const relativePath = path
          .join("uploads", "cv", file.filename)
          .replace(/\\/g, "/");

        certificates[index].file = {
          filename: file.filename,
          path: `/${relativePath}`,
          mimetype: file.mimetype,
          size: file.size,
        };
      });
    }

    /* ================= PARSE CÁC MẢNG JSON KHÁC ================= */
    let workExperiences = [];
    let education = [];
    let skills = [];

    try {
      if (req.body.workExperiences) {
        workExperiences = JSON.parse(req.body.workExperiences);
      }
      if (req.body.education) {
        education = JSON.parse(req.body.education);
      }
      if (req.body.skills) {
        skills = JSON.parse(req.body.skills);
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu work/education/skills không hợp lệ",
      });
    }

    /* ================= PARSE isDefault ================= */
    const isDefault =
      req.body.isDefault === true ||
      req.body.isDefault === "true" ||
      req.body.isDefault === "1";

    /* ================= CREATE PAYLOAD ================= */
    const cvPayload = {
      user: req.user._id,
      title: req.body.title.trim(),
      isDefault,
      nameCV: req.body.nameCV || "",
      jobPosition: req.body.jobPosition || "",
      careerField: req.body.careerField || "",
      careerGoal: req.body.careerGoal || "",
      about: req.body.about || "",
      website: req.body.website || "",
      workExperiences,
      education,
      skills,
      certificates,
    };

    // Log payload trước save để dễ debug
    // console.log("[CREATE CV] Payload gửi vào DB:", JSON.stringify(cvPayload, null, 2));

    const cv = await CV.create(cvPayload);

    // Đếm CV để set default nếu là CV đầu
    const cvCount = await CV.countDocuments({ user: req.user._id });

    // Update User
    const updateUser = {
      $push: {
        cvs: {
          cv: cv._id,
          title: cv.title,
          isDefault: cv.isDefault,
          updatedAt: cv.updatedAt,
        },
      },
    };

    if (cvCount === 1 || isDefault) {
      updateUser.defaultCV = cv._id;
      cv.isDefault = true;
      await cv.save();
    }

    await User.findByIdAndUpdate(req.user._id, updateUser, { new: true });

    return res.status(201).json({
      success: true,
      message: "Tạo CV thành công",
      data: cv,
    });
  } catch (err) {
    console.error("[CREATE CV] LỖI CHI TIẾT:", err);

    if (err.name === "ValidationError") {
      const errors = Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message,
      }));

      // console.log("[CREATE CV] Validation errors từ Mongoose:", errors);

      return res.status(422).json({
        success: false,
        message: "Dữ liệu không hợp lệ theo schema",
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error khi tạo CV",
      errorDev: process.env.NODE_ENV !== "production" ? err.message : undefined,
    });
  }
}

  // Lấy CV mặc định
  static async getDefaultCV(req, res) {
    try {
      const cv = await CV.findOne({
        user: req.user._id,
        isDefault: true,
      }).lean();
      if (!cv) {
        return res
          .status(404)
          .json({ success: false, message: "Chưa có CV mặc định" });
      }
      return res.json({ success: true, data: cv });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }

  // Lấy danh sách CV của mình
  static async getMyCVs(req, res) {
    try {
      const cvs = await CV.find({ user: req.user._id, isDeleted: false })
        .sort({ isDefault: -1, updatedAt: -1 })
        .select("-__v") // ẩn field không cần thiết
        .lean(); // tăng tốc (nếu không cần method của document)

      return res.json({
        success: true,
        count: cvs.length,
        data: cvs,
      });
    } catch (error) {
      // console.error("GetMyCVs Error:", error);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }

  // Lấy CV theo ID
  static async getCVById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "CV ID không hợp lệ",
        });
      }

      const cv = await CV.findOne({
        _id: id,
        user: req.user._id,
        isDeleted: false,
      }).lean();

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: "CV không tồn tại hoặc bạn không có quyền truy cập",
        });
      }

      return res.json({ success: true, data: cv });
    } catch (error) {
      // console.error("🔥 Lỗi getCVById:", error);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }

  // Cập nhật CV
  // static async updateCV(req, res) {
  //   try {
  //     const updates = { ...req.body };

  //     // Chỉ cho phép cập nhật những field này
  //     const allowedFields = [
  //       "title",
  //       "jobPosition",
  //       "careerField",
  //       "careerGoal",
  //       "about",
  //       "website",
  //       "workExperiences",
  //       "education",
  //       "skills",
  //       "certificates",
  //       "templateId",
  //       "themeColor",
  //       "isDefault",
  //     ];

  //     Object.keys(updates).forEach((key) => {
  //       if (!allowedFields.includes(key)) delete updates[key];
  //     });

  //     // Xử lý file mới (thay thế toàn bộ hoặc append tùy bạn)
  //     if (req.files?.attachments && Array.isArray(req.files.attachments)) {
  //       updates.attachments = req.files.attachments.map((file) => ({
  //         filename: file.originalname,
  //         path: file.path.replace(/\\/g, "/"),
  //         mimetype: file.mimetype,
  //         size: file.size,
  //       }));
  //     }

  //     const cv = await CV.findOneAndUpdate(
  //       { _id: req.params.id, user: req.user._id },
  //       updates,
  //       { new: true, runValidators: true }
  //     );

  //     if (!cv) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "CV không tồn tại hoặc bạn không có quyền",
  //       });
  //     }

  //     return res.json({
  //       success: true,
  //       message: "Cập nhật CV thành công",
  //       data: cv,
  //     });
  //   } catch (error) {
  //     // console.error("Update CV Error:", error);
  //     return res
  //       .status(500)
  //       .json({ success: false, message: "Lỗi cập nhật CV" });
  //   }
  // }
  static async updateCV(req, res) {
    try {
      // console.log("🔄 [updateCV] Bắt đầu - CV ID:", req.params.id, "User:", req.user._id);
  
      const cv = await CV.findOne({
        _id: req.params.id,
        user: req.user._id,
        isDeleted: false,
      });
      if (!cv) {
        return res.status(404).json({ success: false, message: "CV không tồn tại hoặc không có quyền" });
      }
  
      // Lưu history (giữ nguyên)
      const oldData = cv.toObject();
      const lastHistory = await CVHistory.findOne({ cvId: req.params.id }).sort({ version: -1 });
      const newVersion = lastHistory ? lastHistory.version + 1 : 1;
  
      await CVHistory.create({
        cvId: req.params.id,
        version: newVersion,
        action: "UPDATE",
        data: oldData,
        changedFields: Object.keys(req.body || {}),
        userId: req.user._id,
        reason: req.body.lastUpdatedReason || "Cập nhật CV",
      });
  
      const updates = {};
  
      // Top-level fields
      ["title", "jobPosition", "nameCV", "careerField", "careerGoal", "about", "website", "templateId", "themeColor", "isDefault", "lastUpdatedReason"].forEach(field => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });
  
      // Arrays text
      if (req.body.workExperiences !== undefined) updates.workExperiences = req.body.workExperiences;
      if (req.body.education !== undefined) updates.education = req.body.education;
      if (req.body.skills !== undefined) updates.skills = req.body.skills;
  
      // Xử lý certificates (text + file mới)
      let certificates = cv.certificates || [];
  
      // Parse certificates từ frontend (an toàn hơn)
      if (req.body.certificates) {
        try {
          let parsed = req.body.certificates;
          if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
          }
          if (Array.isArray(parsed)) {
            certificates = parsed.map(cert => ({
              ...cert,
              file: cert.file || null, // giữ file cũ nếu frontend không gửi lại
            }));
            // console.log("[UPDATE CV] Đã parse certificates mới:", certificates.length);
          }
        } catch (err) {
          console.error("[UPDATE CV] Lỗi parse certificates:", err.message);
          // Không crash, giữ certificates cũ
        }
      }
  
      // Gắn file mới vào certificates (theo thứ tự upload)
      if (req.files?.certificateFiles?.length) {
        // console.log("[UPDATE CV] Có", req.files.certificateFiles.length, "file chứng chỉ mới");
  
        // Nếu frontend gửi certificates mới, dùng mảng đó
        // Nếu không, append vào cuối mảng cũ
        const startIndex = certificates.length;
  
        req.files.certificateFiles.forEach((file, fileIndex) => {
          const certIndex = startIndex + fileIndex;
  
          // Nếu chưa có cert tại vị trí này → tạo mới (trường hợp thêm hoàn toàn mới)
          if (!certificates[certIndex]) {
            certificates[certIndex] = {
              name: "Chứng chỉ mới",
              organization: "",
              issueDate: null,
              expiryDate: null,
              credentialId: "",
              credentialUrl: "",
            };
          }
  
          const relativePath = path.join("uploads", "cv", file.filename).replace(/\\/g, "/");
  
          certificates[certIndex].file = {
            filename: file.filename,
            path: `/${relativePath}`,
            mimetype: file.mimetype,
            size: file.size,
          };
  
          // console.log(`[UPDATE CV] Gán file mới vào cert ${certIndex}: ${certificates[certIndex].file.path}`);
        });
      }
  
      updates.certificates = certificates;
  
      // Tăng version
      updates.version = newVersion;
      updates.updatedBy = req.user._id;
  
      const updatedCV = await CV.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
      );
  
      // console.log("✅ [updateCV] CV updated ID:", updatedCV._id, "| certificates count:", updatedCV.certificates?.length || 0);
  
      return res.json({
        success: true,
        message: "Cập nhật CV thành công",
        data: updatedCV,
      });
    } catch (error) {
      console.error("💥 [updateCV] Lỗi:", error.message);
      return res.status(500).json({
        success: false,
        message: "Lỗi cập nhật CV",
        error: error.message,
      });
    }
  }
  // Xóa CV

  // static async forceDeleteCV(req, res) {
  //   try {
  //     const cv = await CV.findOneAndDelete({
  //       _id: req.params.id,
  //       user: req.user._id,
  //       isDeleted: true,
  //     });

  //     if (!cv) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "CV không tồn tại hoặc chưa ở thùng rác",
  //       });
  //     }

  //     return res.json({
  //       success: true,
  //       message: "Đã xóa CV vĩnh viễn",
  //     });
  //   } catch (error) {
  //     console.error("Force delete CV error:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Lỗi xóa vĩnh viễn CV",
  //     });
  //   }
  // }
  static async forceDeleteCV(req, res) {
    try {
      // console.log("➡️ [FORCE DELETE CV]");
      console.log("🔍 CV ID:", req.params.id);
      console.log("🔍 USER ID:", req.user?._id);

      const cv = await CV.findOne({
        _id: req.params.id,
        user: req.user._id,
        isDeleted: true,
      });

      if (!cv) {
        console.log("⚠️ Không tìm thấy CV hoặc CV chưa ở thùng rác");
        return res.status(404).json({
          success: false,
          message: "CV không tồn tại hoặc chưa ở thùng rác",
        });
      }

      // Thu thập tất cả đường dẫn file cần xóa
      const filesToDelete = [];

      // Certificates
      cv.certificates?.forEach((cert) => {
        if (cert.file?.path) filesToDelete.push(cert.file.path);
      });

      // Attachments
      cv.attachments?.forEach((att) => {
        if (att.path) filesToDelete.push(att.path);
      });

      // Exported files
      cv.exportedFiles?.forEach((exp) => {
        if (exp.path) filesToDelete.push(exp.path);
      });

      // Xóa file thật (async + an toàn)
      for (const filePath of filesToDelete) {
        try {
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            // console.log(`✅ Đã xóa file: ${filePath}`);
          } else {
            // console.log(`⚠️ File không tồn tại: ${filePath}`);
          }
        } catch (unlinkErr) {
          // console.error(`Lỗi xóa file ${filePath}:`, unlinkErr);
          // Không throw error để tiếp tục xóa document
        }
      }

      // Xóa document khỏi DB
      await CV.deleteOne({ _id: cv._id });

      // console.log("✅ Đã xóa vĩnh viễn CV và các file liên quan:", cv._id);

      return res.json({
        success: true,
        message: "Đã xóa CV vĩnh viễn và các file liên quan",
      });
    } catch (error) {
      // console.error("🔥 Force delete CV error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi xóa vĩnh viễn CV",
      });
    }
  }
  // lấy danh sách mà cv bị xóa

  // static async getTrashCVs(req, res) {
  //   try {
  //     const cvs = await CV.find({
  //       user: req.user._id,
  //       isDeleted: true,
  //     }).sort({ deletedAt: -1 });

  //     res.json(cvs);
  //   } catch (error) {
  //     console.error("Get trash CV error:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Lỗi lấy thùng rác",
  //     });
  //   }
  // }
  static async getTrashCVs(req, res) {
    try {
      // console.log("➡️ [GET TRASH CVS]");
      // console.log("🔍 USER ID:", req.user?._id);

      const cvs = await CV.find({
        user: req.user._id,
        isDeleted: true,
      }).sort({ deletedAt: -1 });

      // console.log(`✅ Lấy được ${cvs.length} CV trong thùng rác`);

      res.json({
        success: true,
        data: cvs,
      });
    } catch (error) {
      // console.error("🔥 Get trash CV error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi lấy thùng rác",
      });
    }
  }

  // KHÔI PHỤC CV TỪ THÙNG RÁC
  // static async restoreCV(req, res) {
  //   try {
  //     const cv = await CV.findOne({
  //       _id: req.params.id,
  //       user: req.user._id,
  //       isDeleted: true,
  //     });

  //     if (!cv) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "CV không tồn tại trong thùng rác",
  //       });
  //     }

  //     cv.isDeleted = false;
  //     cv.deletedAt = null;
  //     await cv.save();

  //     return res.json({
  //       success: true,
  //       message: "Khôi phục CV thành công",
  //     });
  //   } catch (error) {
  //     console.error("Restore CV error:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Lỗi khôi phục CV",
  //     });
  //   }
  // }

  static async restoreCV(req, res) {
    try {
      // console.log("➡️ [RESTORE CV]");
      // console.log("🔍 CV ID:", req.params.id);
      // console.log("🔍 USER ID:", req.user?._id);

      const cv = await CV.findOne({
        _id: req.params.id,
        user: req.user._id,
        isDeleted: true,
      });

      if (!cv) {
        // console.log("⚠️ CV không tồn tại trong thùng rác");
        return res.status(404).json({
          success: false,
          message: "CV không tồn tại trong thùng rác",
        });
      }

      cv.isDeleted = false;
      cv.deletedAt = null;
      await cv.save();

      // console.log("✅ Khôi phục CV thành công:", cv._id);

      return res.json({
        success: true,
        message: "Khôi phục CV thành công",
      });
    } catch (error) {
      // console.error("🔥 Restore CV error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khôi phục CV",
      });
    }
  }

  // Xóa cv mềm
  // static async deleteCV(req, res) {
  //   try {
  //     const cv = await CV.findOne({
  //       _id: req.params.id,
  //       user: req.user._id,
  //       isDeleted: false,
  //     });

  //     if (!cv) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Không tìm thấy CV",
  //       });
  //     }

  //     const wasDefault = cv.isDefault; // ⭐ lưu lại trạng thái cũ

  //     // ⭐ XÓA MỀM
  //     cv.isDeleted = true;
  //     cv.deletedAt = new Date();
  //     cv.isDefault = false; // ⭐ CV trong thùng rác KHÔNG được default
  //     await cv.save();

  //     // ⭐ Nếu CV vừa xóa là default → chọn CV khác
  //     if (wasDefault) {
  //       const nextCV = await CV.findOne({
  //         user: req.user._id,
  //         isDeleted: false,
  //       }).sort({ updatedAt: -1 });

  //       if (nextCV) {
  //         nextCV.isDefault = true;
  //         await nextCV.save();
  //       }
  //     }

  //     return res.json({
  //       success: true,
  //       message: "Đã chuyển CV vào thùng rác",
  //     });
  //   } catch (error) {
  //     console.error("Soft delete CV error:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Lỗi xóa CV",
  //     });
  //   }
  // }

  static async deleteCV(req, res) {
    try {
      // console.log("➡️ [SOFT DELETE CV]");
      // console.log("🔍 CV ID:", req.params.id);
      // console.log("🔍 USER ID:", req.user?._id);

      const cv = await CV.findOne({
        _id: req.params.id,
        user: req.user._id,
        isDeleted: false,
      });

      if (!cv) {
        // console.log("⚠️ Không tìm thấy CV hoặc CV đã bị xóa");
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy CV hoặc đã ở thùng rác",
        });
      }

      const wasDefault = cv.isDefault;

      // Soft delete
      cv.isDeleted = true;
      cv.deletedAt = new Date();
      cv.isDefault = false; // Luôn tắt default khi vào trash
      await cv.save();

      // console.log("✅ Đã chuyển CV vào thùng rác:", cv._id);

      // Xử lý default nếu CV vừa xóa là default
      if (wasDefault) {
        // console.log(
        //   "🔄 CV vừa xóa là DEFAULT → tìm CV active khác để set default"
        // );

        const nextCV = await CV.findOne({
          user: req.user._id,
          isDeleted: false, // Chỉ tìm trong active
        }).sort({ updatedAt: -1 });

        if (nextCV) {
          nextCV.isDefault = true;
          await nextCV.save();
          // console.log("✅ Đã set CV mới làm DEFAULT:", nextCV._id);
        } else {
          // console.log("⚠️ Không còn CV active nào → user không có default CV");
        }
      }

      return res.json({
        success: true,
        message: "Đã chuyển CV vào thùng rác",
      });
    } catch (error) {
      // console.error("🔥 Soft delete CV error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi xóa CV",
      });
    }
  }
  // Đặt CV làm mặc định
  static async setDefaultCV(req, res) {
    try {
      const cvId = req.params._id;

      // Tắt tất cả CV mặc định cũ
      await CV.updateMany(
        { user: req.user._id, isDeleted: false },
        { isDefault: false }
      );

      // Bật CV mới
      const cv = await CV.findOneAndUpdate(
        { _id: cvId, user: req.user._id },
        { isDefault: true },
        { new: true }
      );

      if (!cv) {
        return res
          .status(404)
          .json({ success: false, message: "CV không tồn tại" });
      }

      return res.json({
        success: true,
        message: "Đã đặt làm CV mặc định",
        data: cv,
      });
    } catch (error) {
      // console.error("Set Default CV Error:", error);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }

  /* =====================================================
   🔍 SEARCH CV THEO TÊN (KHÔNG ẢNH HƯỞNG HỆ THỐNG CŨ)
===================================================== */
  static async searchMyCVs(req, res) {
    try {
      const { keyword } = req.query;

      if (!keyword || !keyword.trim()) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập tên cần tìm",
        });
      }

      const cvs = await CV.find({
        user: req.user._id,
        isDeleted: false,
        nameCV: {
          $regex: keyword.trim(),
          $options: "i", // không phân biệt hoa thường
        },
      })
        .sort({ isDefault: -1, updatedAt: -1 })
        .select("-__v")
        .lean();

      return res.json({
        success: true,
        count: cvs.length,
        data: cvs,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi tìm kiếm CV",
      });
    }
  }

  // ====================== LỊCH SỬ & CHỮA DỮ LIỆU ======================

  /**
   * Lấy danh sách lịch sử phiên bản của CV
   */
  static async getCVHistory(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "CV ID không hợp lệ" });
      }

      const histories = await CVHistory.find({ cvId: id })
        .sort({ version: -1 }) // Mới nhất trước
        .select("version action createdAt reason changedFields userId")
        .populate("userId", "name email") // Optional: hiển thị info user
        .lean();

      return res.json({
        success: true,
        count: histories.length,
        data: histories,
      });
    } catch (error) {
      console.error("Get CV History Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi lấy lịch sử CV" });
    }
  }

  /**
   * Khôi phục CV về một phiên bản cũ cụ thể
   */
  static async restoreCVVersion(req, res) {
    try {
      const { id, version } = req.params;
      const userId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "CV ID không hợp lệ" });
      }

      const history = await CVHistory.findOne({
        cvId: id,
        version: parseInt(version),
      });
      if (!history) {
        return res
          .status(404)
          .json({ success: false, message: "Phiên bản không tồn tại" });
      }

      const oldData = history.data;

      // Tìm CV hiện tại để update
      const cv = await CV.findOne({ _id: id, user: userId, isDeleted: false });
      if (!cv) {
        return res.status(404).json({
          success: false,
          message: "CV không tồn tại hoặc không có quyền",
        });
      }

      // Chuẩn bị updates từ oldData (chỉ copy fields chính, giữ nguyên một số meta như _id, user, isDeleted)
      const updates = {
        title: oldData.title,
        nameCV: oldData.nameCV,
        jobPosition: oldData.jobPosition,
        careerField: oldData.careerField,
        careerGoal: oldData.careerGoal,
        about: oldData.about,
        website: oldData.website,
        workExperiences: oldData.workExperiences || [],
        education: oldData.education || [],
        skills: oldData.skills || [],
        certificates: oldData.certificates || [],
        attachments: oldData.attachments || [], // giữ file cũ
        exportedFiles: oldData.exportedFiles || [],
        templateId: oldData.templateId,
        themeColor: oldData.themeColor,
        // Không copy isDefault, isDeleted, deletedAt, createdAt (giữ nguyên trạng thái hiện tại)
      };

      // Tăng version mới
      const lastHistory = await CVHistory.findOne({ cvId: id }).sort({
        version: -1,
      });
      const newVersion = lastHistory ? lastHistory.version + 1 : 1;

      updates.version = newVersion;
      updates.updatedBy = userId;
      updates.lastUpdatedReason = `Khôi phục từ version ${version}`;

      // Update CV
      const restoredCV = await CV.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      // Ghi history cho hành động restore
      await CVHistory.create({
        cvId: id,
        version: newVersion,
        action: "RESTORE",
        data: oldData,
        changedFields: ["restored_from_version", version],
        userId,
        reason: req.body.reason || `Khôi phục từ version ${version}`,
      });

      return res.json({
        success: true,
        message: `Đã khôi phục về version ${version}`,
        data: restoredCV,
      });
    } catch (error) {
      console.error("Restore CV Version Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi khôi phục phiên bản" });
    }
  }

  // Optional: Xem chi tiết 1 version cũ (nếu frontend cần preview)
  static async getCVVersionDetail(req, res) {
    try {
      const { id, version } = req.params;

      const history = await CVHistory.findOne({
        cvId: id,
        version: parseInt(version),
      })
        .populate("userId", "name email")
        .lean();

      if (!history) {
        return res
          .status(404)
          .json({ success: false, message: "Phiên bản không tồn tại" });
      }

      return res.json({ success: true, data: history });
    } catch (error) {
      console.error("Get CV Version Detail Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi lấy chi tiết phiên bản" });
    }
  }
}

export default CvController;
