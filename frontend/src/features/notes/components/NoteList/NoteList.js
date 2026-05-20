// src/features/notes/components/NoteList.js
import React from 'react';
import classNames from 'classnames/bind';
import styles from './NoteList.module.scss';
import NoteItem from '../NoteItem/NoteItem'; 

const cx = classNames.bind(styles);

function NoteList({
    notes = [],
    onEdit,
    onDelete,
    onTogglePin,
    loading = false,
    isSubmitting = false, // Thêm để disable tương tác khi đang xử lý
}) {
    // ==================== LOADING STATE ====================
    if (loading) {
        return (
            <div className={cx('loading')}>
                <div className={cx('spinner')}></div>
                Đang tải ghi chú...
            </div>
        );
    }

    // ==================== EMPTY STATE ====================
    if (notes.length === 0) {
        return (
            <div className={cx('empty-state')}>
                <div className={cx('empty-icon')}>📝</div>
                <p>Chưa có ghi chú nào</p>
                <small>Hãy tạo ghi chú đầu tiên để theo dõi quá trình ứng tuyển của bạn.</small>
            </div>
        );
    }

    // ==================== SORT NOTES ====================
    const sortedNotes = [...notes].sort((a, b) => {
        // Ưu tiên ghi chú được ghim
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // Sau đó sắp theo thời gian mới nhất
        return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
    });

    return (
        <div className={cx('notes-list')}>
            {sortedNotes.map((note) => (
                <NoteItem
                    key={note._id || note.id} 
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                    isSubmitting={isSubmitting}
                />
            ))}
        </div>
    );
}

export default NoteList;
