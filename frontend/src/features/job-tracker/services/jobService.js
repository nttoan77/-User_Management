// src/features/jobs/services/jobService.js
import httpRequest from '~/utils/httpRequest';

const TRACKSCHEDULES_API = '/api/TrackSchedules';

export const jobService = {

    /**
     * Lấy danh sách tất cả công việc
     */
    async getJobs(params = {}) {
        try {
            const response = await httpRequest.get(TRACKSCHEDULES_API, { params });
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách jobs:', error.response?.data || error);
            throw error;
        }
    },

    /**
     * Lấy chi tiết một job
     */
    async getJobById(jobId) {
        try {
            const response = await httpRequest.get(`${TRACKSCHEDULES_API}/${jobId}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('❌ Lỗi lấy job theo ID:', error);
            throw error;
        }
    },

    /**
     * Tạo job mới
     */
    async createJob(jobData) {
        try {
            const response = await httpRequest.post(TRACKSCHEDULES_API, jobData);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('❌ Lỗi tạo job:', error.response?.data || error);
            throw error;
        }
    },

    /**
     * Cập nhật job
     */
    async updateJob(jobId, jobData) {
        try {
            const response = await httpRequest.put(`${TRACKSCHEDULES_API}/${jobId}`, jobData);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('❌ Lỗi cập nhật job:', error.response?.data || error);
            throw error;
        }
    },

    /**
     * Xóa job
     */
    async deleteJob(jobId) {
        try {
            const response = await httpRequest.delete(`${TRACKSCHEDULES_API}/${jobId}`);
            return response.data?.data || { success: true, id: jobId };
        } catch (error) {
            console.error('❌ Lỗi xóa job:', error.response?.data || error);
            throw error;
        }
    },

    /**
     * Cập nhật trạng thái job (dùng cho Kanban drag & drop)
     */
    async updateJobStatus(jobId, status) {
        try {
            const response = await httpRequest.patch(`${TRACKSCHEDULES_API}/${jobId}/status`, { status });
            return response.data?.data || response.data;
        } catch (error) {
            console.error('❌ Lỗi cập nhật trạng thái job:', error);
            throw error;
        }
    }
};