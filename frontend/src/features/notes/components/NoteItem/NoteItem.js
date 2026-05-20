// // src/features/notes/components/NoteItem.js
// import React from 'react';
// import classNames from 'classnames/bind';
// import styles from './NoteItem.module.scss';

// const cx = classNames.bind(styles);

// const NoteItem = ({
//     note,
//     onEdit,
//     onDelete,
//     onTogglePin,
//     isSubmitting = false,
// }) => {
//     const formatDate = (dateString) => {
//         if (!dateString) return 'Không rõ thời gian';

//         const date = new Date(dateString);
//         return date.toLocaleDateString('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     // Click vào card → mở chỉnh sửa
//     const handleCardClick = (e) => {
//         if (e.target.closest('button') || e.target.closest('.tag')) return;
//         onEdit(note);
//     };

//     // Click vào tag
//     const handleTagClick = (tag, e) => {
//         e.stopPropagation();
//         alert(`Tag: # ${tag}`);
//         // Ví dụ sau này: onTagFilter(tag);
//     };

//     const handleDelete = (e) => {
//         e.stopPropagation();
//         if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này không?')) {
//             onDelete(note._id || note.id);
//         }
//     };

//     const handleTogglePin = (e) => {
//         e.stopPropagation();
//         onTogglePin(note._id || note.id);
//     };

//     const handleEdit = (e) => {
//         e.stopPropagation();
//         onEdit(note);
//     };

//     return (
//         <div
//             className={cx('note-card', { pinned: note.isPinned })}
//             onClick={handleCardClick}
//         >
//             {/* Pin Icon */}
//             {note.isPinned && <div className={cx('pin-icon')}>★</div>}

//             {/* Title */}
//             {note.title && <h3 className={cx('note-title')}>{note.title}</h3>}

//             {/* Content */}
//             <p className={cx('note-content')}>{note.content}</p>

//             {/* Tags */}
//             {note.tags && note.tags.length > 0 && (
//                 <div className={cx('note-tags')}>
//                     {note.tags.map((tag, index) => (
//                         <span
//                             key={index}
//                             className={cx('tag')}
//                             onClick={(e) => handleTagClick(tag, e)}
//                         >
//                             #{tag}
//                         </span>
//                     ))}
//                 </div>
//             )}

//             {/* Footer */}
//             <div className={cx('note-footer')}>
//                 <span className={cx('note-date')}>
//                     {formatDate(note.createdAt || note.updatedAt)}
//                 </span>

//                 <div className={cx('note-actions')}>
//                     <button
//                         className={cx('action-btn', 'pin-btn')}
//                         onClick={handleTogglePin}
//                         disabled={isSubmitting}
//                         title={note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
//                     >
//                         {note.isPinned ? '★' : '☆'}
//                     </button>

//                     <button
//                         className={cx('action-btn', 'delete-btn')}
//                         onClick={handleDelete}
//                         disabled={isSubmitting}
//                         title="Xóa ghi chú"
//                     >
//                         🗑️
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NoteItem;

// =============================
// src/features/notes/components/NoteItem.js
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './NoteItem.module.scss';

const cx = classNames.bind(styles);

const NoteItem = ({ note, onEdit, onDelete, onTogglePin, isSubmitting = false }) => {
    const [showTagPopup, setShowTagPopup] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'Không rõ thời gian';

        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Click vào card → mở chỉnh sửa
    const handleCardClick = (e) => {
        if (e.target.closest('button') || e.target.closest('.tag')) return;
        onEdit(note);
    };

    // Click vào tag → hiện popup to
    const handleTagClick = (tag, e) => {
        e.stopPropagation();
        setShowTagPopup(tag);
    };

    const closeTagPopup = () => {
        setShowTagPopup(null);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này không?')) {
            onDelete(note._id || note.id);
        }
    };

    const handleTogglePin = (e) => {
        e.stopPropagation();
        onTogglePin(note._id || note.id);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(note);
    };

    return (
        <>
            <div className={cx('note-card', { pinned: note.isPinned })} onClick={handleCardClick}>
                {/* Pin Icon */}
                {note.isPinned && <div className={cx('pin-icon')}>★</div>}

                {/* Title */}
                {note.title && <h3 className={cx('note-title')}>{note.title}</h3>}

                {/* Content */}
                <p className={cx('note-content')}>{note.content}</p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                    <div className={cx('note-tags')}>
                        {note.tags.map((tag, index) => (
                            <span key={index} className={cx('tag')} onClick={(e) => handleTagClick(tag, e)}>
                                # {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className={cx('note-footer')}>
                    <span className={cx('note-date')}>{formatDate(note.createdAt || note.updatedAt)}</span>

                    <div className={cx('note-actions')}>
                        <button
                            className={cx('action-btn', 'pin-btn')}
                            onClick={handleTogglePin}
                            disabled={isSubmitting}
                            title={note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
                        >
                            {note.isPinned ? '★' : '☆'}
                        </button>


                        <button
                            className={cx('action-btn', 'delete-btn')}
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            title="Xóa ghi chú"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>

            {/* ==================== TAG POPUP TO Ở GIỮA MÀN HÌNH ==================== */}
            {showTagPopup && (
                <div className={cx('tag-popup-overlay')} onClick={closeTagPopup}>
                    <div className={cx('tag-popup')} onClick={(e) => e.stopPropagation()}>
                        <button className={cx('close-popup')} onClick={closeTagPopup}>
                            ✕
                        </button>

                        <div className={cx('tag-content')}>
                            <p className={cx('tag-subtitle')}>Ư điểm được chọn là: </p>
                            <span className={cx('big-tag')}> {showTagPopup}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NoteItem;
