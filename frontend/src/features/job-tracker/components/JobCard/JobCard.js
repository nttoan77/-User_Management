// src/features/jobs/components/JobCard.js
import React from 'react';
import classNames from 'classnames/bind';
import styles from './JobCard.module.scss';
import { Calendar, MapPin, Clock } from 'lucide-react';

const cx = classNames.bind(styles);

const statusConfig = {
    applied: { label: 'Đã Apply', color: '#eab308', bg: '#fefce8' },
    waiting: { label: 'Đang chờ', color: '#3b82f6', bg: '#eff6ff' },
    interview: { label: 'Phỏng vấn', color: '#8b5cf6', bg: '#f3e8ff' },
    offered: { label: 'Đậu Offer', color: '#10b981', bg: '#ecfdf5' },
    rejected: { label: 'Từ chối', color: '#ef4444', bg: '#fee2e2' },
};

const JobCard = ({ job, onEdit, onDelete }) => {
    const status = statusConfig[job.status] || statusConfig.applied;

    return (
        <div className={cx('job-card')}>
            <div className={cx('card-header')}>
                <div>
                    <h3 className={cx('company')}>{job.companyName}</h3>
                    <p className={cx('position')}>{job.position}</p>
                </div>

                <div className={cx('status')} style={{ backgroundColor: status.bg, color: status.color }}>
                    {status.label}
                </div>
            </div>

            <div className={cx('info')}>
                {job.location && (
                    <div className={cx('info-item')}>
                        <MapPin size={16} />
                        <span>{job.location}</span>
                    </div>
                )}

                {job.appliedDate && (
                    <div className={cx('info-item')}>
                        <Calendar size={16} />
                        <span>Apply: {new Date(job.appliedDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                )}

                {job.interviewDate && (
                    <div className={cx('info-item', 'highlight')}>
                        <Clock size={16} />
                        <span>Phỏng vấn: {new Date(job.interviewDate).toLocaleDateString('vi-VN')} {job.interviewTime}</span>
                    </div>
                )}
            </div>

            {job.note && (
                <div className={cx('note')}>
                    📝 {job.note}
                </div>
            )}

            <div className={cx('actions')}>
                <button className={cx('edit-btn')} onClick={() => onEdit(job)}>
                    Chỉnh sửa
                </button>
                <button className={cx('delete-btn')} onClick={() => onDelete(job._id || job.id)}>
                    Xóa
                </button>
            </div>
        </div>
    );
};

export default JobCard;