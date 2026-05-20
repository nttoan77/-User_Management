// src/features/notes/types.js   (dù là JS nhưng vẫn nên có file types để dễ đọc)
export const Note = {
    id: "string",                    // unique id
    applicationId: "string",         // thuộc về đơn ứng tuyển nào (nếu có)
    cvId: "string",                  // hoặc thuộc về CV nào
    title: "string",                 // Tiêu đề note
    content: "string",               // Nội dung chính
    tags: ["interview", "salary"],   // Mảng tag
    isPinned: false,
    createdAt: "2026-04-28T10:00:00Z",
    updatedAt: "2026-04-28T10:30:00Z"
  };