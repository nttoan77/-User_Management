// src/features/jobs/hooks/useJobs.js
import { useState, useEffect, useCallback } from 'react';
import { jobService } from '../services/jobService';

const useJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ==================== LẤY DANH SÁCH JOBS ====================
    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await jobService.getJobs();
            setJobs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Lỗi tải danh sách jobs:', err);
            setError(err.response?.data?.message || 'Không thể tải danh sách công việc');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== THÊM JOB MỚI ====================
    const addJob = useCallback(async (jobData) => {
        try {
            setIsSubmitting(true);
            const newJob = await jobService.createJob(jobData);

            // Optimistic update
            setJobs((prev) => [newJob, ...prev]);
            return newJob;
        } catch (err) {
            console.error('❌ Lỗi thêm job:', err);
            setError(err.response?.data?.message || 'Không thể thêm công việc');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // ==================== CẬP NHẬT JOB ====================
    // ==================== CẬP NHẬT JOB ====================
    const updateJob = useCallback(async (jobId, jobData) => {
        try {
            setIsSubmitting(true);

            // === SỬA Ở ĐÂY ===
            const id = typeof jobId === 'object' ? jobId._id || jobId.id : jobId;

            if (!id) {
                throw new Error('Không tìm thấy ID của job');
            }

            const updatedJob = await jobService.updateJob(id, jobData);

            setJobs((prev) => prev.map((job) => (job._id === id || job.id === id ? { ...job, ...updatedJob } : job)));

            return updatedJob;
        } catch (err) {
            console.error('❌ Lỗi cập nhật job:', err);
            setError(err.response?.data?.message || err.message || 'Không thể cập nhật công việc');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // ==================== XÓA JOB ====================
    const deleteJob = useCallback(async (jobId) => {
        try {
            await jobService.deleteJob(jobId);

            // Optimistic delete
            setJobs((prev) => prev.filter((job) => job._id !== jobId && job.id !== jobId));
        } catch (err) {
            console.error('❌ Lỗi xóa job:', err);
            setError(err.response?.data?.message || 'Không thể xóa công việc');
            throw err;
        }
    }, []);

    // ==================== CẬP NHẬT TRẠNG THÁI (cho Kanban) ====================
    const updateJobStatus = useCallback(async (jobId, newStatus) => {
        try {
            const updated = await jobService.updateJob(jobId, { status: newStatus });

            setJobs((prev) =>
                prev.map((job) =>
                    job._id === jobId || job.id === jobId ? { ...job, status: newStatus, ...updated } : job,
                ),
            );
        } catch (err) {
            console.error('❌ Lỗi cập nhật trạng thái job:', err);
        }
    }, []);

    // Load dữ liệu khi component mount
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    return {
        jobs,
        loading,
        error,
        isSubmitting,
        fetchJobs,
        addJob,
        updateJob,
        deleteJob,
        updateJobStatus,
    };
};

export default useJobs;
