// src/features/jobs/components/KanbanBoard.js
import React, { useState, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './Board.module.scss';
import JobCard from '../JobCard/JobCard';
import { jobService } from '../../services/jobService';

const cx = classNames.bind(styles);

const COLUMNS = [
    { key: 'applied', label: 'Đã Apply', color: '#3b82f6' },
    { key: 'screening', label: 'Screening', color: '#8b5cf6' },
    { key: 'interview', label: 'Phỏng vấn', color: '#f59e0b' },
    { key: 'offer', label: 'Offer', color: '#10b981' },
    { key: 'rejected', label: 'Từ chối', color: '#ef4444' },
];

const KanbanBoard = ({ 
    jobs = [], 
    onEditJob, 
    onDeleteJob, 
    updateJobStatus   // ← Nhận từ hook useJobs
}) => {
    const [draggedJob, setDraggedJob] = useState(null);

    // Nhóm job theo status
    const jobsByStatus = useMemo(() => {
        const grouped = {};
        COLUMNS.forEach(col => {
            grouped[col.key] = jobs.filter(job => job.status === col.key);
        });
        return grouped;
    }, [jobs]);

    const handleDragStart = (e, job) => {
        setDraggedJob(job);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        if (!draggedJob || draggedJob.status === newStatus) return;

        try {
            await updateJobStatus(draggedJob._id || draggedJob.id, newStatus);
        } catch (error) {
            alert('Không thể cập nhật trạng thái công việc!');
        }

        setDraggedJob(null);
    };

    const handleDragEnd = () => {
        setDraggedJob(null);
    };

    return (
        <div className={cx('kanban-board')}>
            {COLUMNS.map((column) => {
                const columnJobs = jobsByStatus[column.key] || [];
                
                return (
                    <div 
                        key={column.key}
                        className={cx('column')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.key)}
                    >
                        <div className={cx('column-header')}>
                            <div className={cx('column-title')}>
                                <span 
                                    className={cx('dot')} 
                                    style={{ backgroundColor: column.color }}
                                />
                                {column.label}
                            </div>
                            <span className={cx('count')}>{columnJobs.length}</span>
                        </div>

                        <div className={cx('column-content')}>
                            {columnJobs.length === 0 ? (
                                <div className={cx('empty-column')}>
                                    Chưa có công việc nào
                                </div>
                            ) : (
                                columnJobs.map((job) => (
                                    <div 
                                        key={job._id || job.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, job)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <JobCard 
                                            job={job}
                                            onClick={() => {}} // Sau này mở Job Detail
                                            onEdit={() => onEditJob(job)}
                                            onDelete={() => onDeleteJob(job._id || job.id)}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default KanbanBoard;