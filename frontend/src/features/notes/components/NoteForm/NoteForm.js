// src/features/notes/components/NoteForm.js
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './NoteForm.module.scss';

const cx = classNames.bind(styles);

function NoteForm({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false, title = '' }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        isPinned: false,
    });

    // Reset / Fill form khi modal mở hoặc initialData thay đổi
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
                isPinned: !!initialData.isPinned,
            });
        } else {
            setFormData({
                title: '',
                content: '',
                tags: '',
                isPinned: false,
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // ==================== CHỮA Ở ĐÂY ====================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.content.trim()) {
            alert('Vui lòng nhập nội dung ghi chú!');
            return;
        }

        const tagsArray = formData.tags
            ? formData.tags
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean)
            : [];

        const noteData = {
            title: formData.title.trim(),
            content: formData.content.trim(),
            tags: tagsArray,
            isPinned: formData.isPinned,
        };

        try {
            // Debug log giúp xem dữ liệu đang gửi gì
            console.log('📤 [NoteForm] Sending data:', {
                isUpdate: !!initialData,
                noteId: initialData?._id || initialData?.id,
                noteData,
            });

            if (initialData) {
                // Mode Edit - ĐÃ SỬA: Đảm bảo thứ tự tham số đúng
                const noteId = initialData._id || initialData.id;

                if (!noteId) {
                    throw new Error('Không tìm thấy ID ghi chú để cập nhật');
                }

                await onSubmit(noteId, noteData); // ← Quan trọng: id trước, data sau
            } else {
                // Mode Create
                await onSubmit(noteData);
            }

            onClose(); // Đóng modal sau khi submit thành công
        } catch (error) {
            console.error('❌ Lỗi lưu note:', error);
            alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu ghi chú!');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={cx('modal-overlay')}>
            <div className={cx('modal-content')}>
                <div className={cx('modal-header')}>
                    <h3>{title || (initialData ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú mới')}</h3>
                    <button className={cx('close-btn')} onClick={onClose} type="button" disabled={isSubmitting}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="title">Tiêu đề ghi chú</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ví dụ: Câu hỏi phỏng vấn React"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="content">
                            Nội dung <span className={cx('required')}>*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Nhập nội dung ghi chú..."
                            rows={8}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* ==================== THÊM LẠI INPUT TAGS ==================== */}
                    <div className={cx('form-group')}>
                        <label htmlFor="tags">Tags (cách nhau bởi dấu phẩy)</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="react, javascript, interview, todo"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={cx('modal-footer')}>
                        <div className={cx('checkbox-group')}>
                            <label className={cx('checkbox-label')}>
                                <input
                                    type="checkbox"
                                    name="isPinned"
                                    checked={formData.isPinned}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                Ghim ghi chú này lên đầu
                            </label>
                        </div>
                        <div className={cx('btn-footer')}>
                            <button  type="button"
                                className={cx('btn', 'btn-cancel')}
                                onClick={onClose}
                                disabled={isSubmitting}
                            
                            >
                            Hủy 
                            </button>
                            <button
                                type="submit"
                                className={cx('btn', 'btn-primary')}
                                disabled={isSubmitting || !formData.content.trim()}
                            >
                                {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Lưu ghi chú'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NoteForm;
