import mongoose from 'mongoose';

const cvHistorySchema = new mongoose.Schema({
  cvId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CV',
    required: true,
    index: true,
  },
  version: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'RESTORE'],
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Lưu full snapshot của CV lúc đó (dễ restore)
    required: true,
  },
  changedFields: [String], // Optional: chỉ lưu fields thay đổi để tiết kiệm
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: String, // Optional: lý do chỉnh sửa (nếu frontend gửi)
  ip: String,
}, {
  timestamps: true,
});

// Index để query nhanh lịch sử của 1 CV
cvHistorySchema.index({ cvId: 1, version: -1 });

export default mongoose.model('CVHistory', cvHistorySchema);