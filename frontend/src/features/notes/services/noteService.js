// src/features/notes/services/noteService.js
import httpRequest from '~/utils/httpRequest';

const NOTE_API = '/api/notes';

export const noteService = {

    /**
     * Lấy danh sách ghi chú
     * GET /api/notes
     */
    async getNotes(applicationId = null, params = {}) {
        try {
            let url = NOTE_API;
            const queryParams = { ...params };

            if (applicationId) {
                queryParams.applicationId = applicationId;
            }

            const response = await httpRequest.get(url, { params: queryParams });

            // Linh hoạt với nhiều cấu trúc response
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách notes:', error.response?.data || error);
            throw error;
        }
    },

    /**
     * Lấy chi tiết một ghi chú (nếu cần sau này)
     */
    async getNoteById(noteId) {
        try {
            const response = await httpRequest.get(`${NOTE_API}/${noteId}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('❌ Lỗi lấy note theo ID:', error);
            throw error;
        }
    },

    /**
     * Tạo ghi chú mới
     * POST /api/notes
     */
    async createNote(noteData) {
        try {
            const response = await httpRequest.post(NOTE_API, noteData);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('❌ Lỗi tạo note:', error.response?.data || error);
            throw error;
        }
    },

    /**
     * Cập nhật ghi chú
     * PUT /api/notes/:id
     */
    async updateNote(noteId, noteData) {
        try {
            const response = await httpRequest.put(`${NOTE_API}/${noteId}`, noteData);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('❌ Lỗi cập nhật note:', error.response?.data || error);
            throw error;
        }
    },

    /**
     * Xóa ghi chú
     * DELETE /api/notes/:id
     */
    async deleteNote(noteId) {
        try {
            const response = await httpRequest.delete(`${NOTE_API}/${noteId}`);
            return response.data?.data || response.data || { success: true, id: noteId };
        } catch (error) {
            console.error('❌ Lỗi xóa note:', error.response?.data || error);
            throw error;
        }
    },

    /**
     * Toggle ghim ghi chú - SỬ DỤNG ROUTE RIÊNG
     * PATCH /api/notes/:id/toggle-pin
     */
    async togglePin(noteId) {
        try {
            const response = await httpRequest.patch(`${NOTE_API}/${noteId}/toggle-pin`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('❌ Lỗi toggle pin note:', error.response?.data || error);
            throw error;
        }
    },

    // === Các hàm tiện ích bổ sung ===
    
    /**
     * Cập nhật một phần ghi chú (nếu backend hỗ trợ PATCH sau này)
     */
    async patchNote(noteId, noteData) {
        try {
            const response = await httpRequest.patch(`${NOTE_API}/${noteId}`, noteData);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('❌ Lỗi patch note:', error);
            throw error;
        }
    }
};