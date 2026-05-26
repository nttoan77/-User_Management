// src/features/jobs/components/JobTracker.js
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './jobTracker.module.scss';
import useJobs from '../../hooks/useJobs';
import JobCard from '../JobCard/JobCard';
import JobForm from '../JobForm/JobForm';
import { Plus } from 'lucide-react';

const cx = classNames.bind(styles);

const STATUS_FILTERS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'applied', label: 'Đã Apply' },
    { key: 'waiting', label: 'Đang chờ' },
    { key: 'interview', label: 'Phỏng vấn' },
    { key: 'offered', label: 'Đậu' },
    { key: 'rejected', label: 'Từ chối' },
];

function JobTracker() {
    const [filter, setFilter] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    const { jobs, loading, addJob, updateJob, deleteJob } = useJobs();

    const filteredJobs = filter === 'all' ? jobs : jobs.filter((job) => job.status === filter);

    // Thống kê
    const stats = {
        total: jobs.length,
        applied: jobs.filter((j) => j.status === 'applied').length,
        interview: jobs.filter((j) => j.status === 'interview').length,
        offered: jobs.filter((j) => j.status === 'offered').length,
    };

    const handleAddNew = () => {
        setEditingJob(null);
        setIsFormOpen(true);
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setIsFormOpen(true);
    };

    return (
        <div className={cx('job-tracker')}>
            {/* Header + Thống kê */}
            <div className={cx('header')}>
                <div>
                    <h1>track schedule</h1>
                    <p>Theo dõi quá trình ứng tuyển của bạn</p>
                </div>

                <button className={cx('add-btn')} onClick={handleAddNew}>
                    <Plus size={20} />  Thêm Job Mới
                </button>
            </div>

            {/* Thống kê nhỏ */}
            <div className={cx('stats')}>
                <div className={cx('stat-card')}>
                    <span>Tổng công việc</span>
                    <strong>{stats.total}</strong>
                </div>
                <div className={cx('stat-card')}>
                    <span>Đã Apply</span>
                    <strong>{stats.applied}</strong>
                </div>
                <div className={cx('stat-card')}>
                    <span>Phỏng vấn</span>
                    <strong>{stats.interview}</strong>
                </div>
                <div className={cx('stat-card', 'success')}>
                    <span>Đậu Offer</span>
                    <strong>{stats.offered}</strong>
                </div>
            </div>

            {/* Filter */}
            <div className={cx('filter-bar')}>
                {STATUS_FILTERS.map((item) => (
                    <button
                        key={item.key}
                        className={cx('filter-btn', { active: filter === item.key })}
                        onClick={() => setFilter(item.key)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Danh sách Job */}
            <div className={cx('job-list')}>
                {loading ? (
                    <p>Đang tải...</p>
                ) : filteredJobs.length === 0 ? (
                    <p className={cx('empty')}>Chưa có công việc nào. Hãy thêm job đầu tiên!</p>
                ) : (
                    filteredJobs.map((job) => (
                        <JobCard key={job._id} job={job} onEdit={handleEdit} onDelete={deleteJob} />
                    ))
                )}
            </div>

            {/* Form */}
            <JobForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingJob(null);
                }}
                initialData={editingJob}
                onSubmit={editingJob ? updateJob : addJob}
            />
        </div>
    );
}

export default JobTracker;
