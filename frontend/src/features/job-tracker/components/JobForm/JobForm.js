// src/features/jobs/components/JobForm.js
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './JobForm.module.scss';

const cx = classNames.bind(styles);

const STATUS_OPTIONS = [
    { value: 'applied', label: 'Đã Apply' },
    { value: 'waiting', label: 'Đang chờ' },
    { value: 'interview', label: 'Phỏng vấn' },
    { value: 'offered', label: 'Đậu Offer' },
    { value: 'rejected', label: 'Từ chối' },
];

function JobForm({ isOpen, onClose, initialData = null, onSubmit }) {
    const [formData, setFormData] = useState({
        companyName: '',
        position: '',
        location: '',
        appliedDate: '',
        status: 'applied',
        interviewDate: '',
        interviewTime: '',
        note: '',
    });

    // Fill dữ liệu khi chỉnh sửa
    useEffect(() => {
        if (initialData) {
            setFormData({
                companyName: initialData.companyName || '',
                position: initialData.position || '',
                location: initialData.location || '',
                appliedDate: initialData.appliedDate ? initialData.appliedDate.split('T')[0] : '',
                status: initialData.status || 'applied',
                interviewDate: initialData.interviewDate ? initialData.interviewDate.split('T')[0] : '',
                interviewTime: initialData.interviewTime || '',
                note: initialData.note || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.companyName?.trim() || !formData.position?.trim()) {
            alert('Vui lòng nhập tên công ty và vị trí!');
            return;
        }

        const jobData = {
            companyName: formData.companyName.trim(),
            position: formData.position.trim(),
            location: formData.location?.trim() || '',
            appliedDate: formData.appliedDate || null,
            status: formData.status,
            interviewDate: formData.interviewDate || null,
            interviewTime: formData.interviewTime || null,
            note: formData.note?.trim() || '',
        };

        try {
            if (initialData) {
                // === MODE CHỈNH SỬA ===
                const jobId = initialData._id || initialData.id;

                if (!jobId) {
                    throw new Error('Không tìm thấy ID công việc để cập nhật');
                }

                // console.log('📤 Cập nhật Job - ID:', jobId);
                await onSubmit(jobId, jobData); // Truyền ID trước, data sau
            } else {
                // === MODE TẠO MỚI ===
                // console.log('📤 Tạo Job mới');
                await onSubmit(jobData);
            }

            onClose(); // Đóng modal sau khi thành công
        } catch (error) {
            console.error('❌ Lỗi khi lưu Job:', error);
            alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu thông tin!');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={cx('modal-overlay')}>
            <div className={cx('modal-content')}>
                <div className={cx('modal-header')}>
                    <h3>{initialData ? 'Chỉnh sửa Job' : 'Thêm Job Mới'}</h3>
                    <button className={cx('close-btn')} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label>
                            Tên công ty <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Công ty ứng tuyển"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>
                            Vị trí <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            placeholder="Vị trí công việc mong muốn"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Địa điểm</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Địa điểm mà bạn đi phỏng vấn"
                        />
                    </div>

                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label>Ngày Apply</label>
                            <input
                                type="date"
                                name="appliedDate"
                                value={formData.appliedDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label>Trạng thái</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label>Ngày phỏng vấn</label>
                            <input
                                type="date"
                                name="interviewDate"
                                value={formData.interviewDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label>Giờ phỏng vấn</label>
                            <input
                                type="time"
                                name="interviewTime"
                                value={formData.interviewTime}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label>Ghi chú</label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Các khâu cần chuẩn bị...."
                        />
                    </div>

                    <div className={cx('modal-footer')}>
                        <button type="button" className={cx('btn', 'btn-cancel')} onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className={cx('btn', 'btn-primary')}>
                            {initialData ? 'Cập nhật' : 'Thêm Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default JobForm;
