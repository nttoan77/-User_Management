// src/features/notes/components/NotesSection.js
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './NotesSection.module.scss';

import useGeneralNotes from '../../hooks/useGeneralNotes';
import NoteList from '../NoteList/NoteList';
import NoteForm from '../NoteForm/NoteForm';

const cx = classNames.bind(styles);

function NotesSection() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    const { notes, loading, isSubmitting, addNote, updateNote, deleteNote, togglePin } = useGeneralNotes();

    // Mở form thêm mới
    const handleAddNew = () => {
        setEditingNote(null);
        setIsFormOpen(true);
    };

    // Mở form chỉnh sửa
    const handleEdit = (note) => {
        setEditingNote(note);
        setIsFormOpen(true);
    };

    // Xử lý submit từ NoteForm
    const handleSubmitNote = async (firstParam, secondParam) => {
        try {
            // Debug log
            // console.log('🚀 [NotesSection] handleSubmitNote called:', {
            //     firstParam,
            //     secondParam,
            // });

            let noteId = null;
            let noteData = null;

            // Xử lý linh hoạt thứ tự tham số (vì NoteForm gửi noteId trước)
            if (typeof firstParam === 'string' || (firstParam && firstParam._id)) {
                noteId = typeof firstParam === 'string' ? firstParam : firstParam._id || firstParam.id;
                noteData = secondParam;
            } else {
                noteId = typeof secondParam === 'string' ? secondParam : secondParam?._id || secondParam?.id;
                noteData = firstParam;
            }

            // console.log('🔄 [NotesSection] Processed:', { noteId, noteData });

            if (noteId) {
                // Mode Edit
                if (!noteId) throw new Error('Không tìm thấy ID ghi chú');
                await updateNote(noteId, noteData);
            } else {
                // Mode Create
                await addNote(noteData);
            }

            setIsFormOpen(false);
            setEditingNote(null);
        } catch (error) {
            console.error('❌ Lỗi khi lưu ghi chú:', error);
            alert(error.message || error.response?.data?.message || 'Có lỗi xảy ra khi lưu ghi chú!');
        }
    };
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingNote(null);
    };

    return (
        <div className={cx('notes-section')}>
            <div className={cx('section-header')}>
                <h2>Ghi chú của tôi</h2>
                <button className={cx('add-note-btn')} onClick={handleAddNew} disabled={isSubmitting}>
                    + Thêm ghi chú mới
                </button>
            </div>

            <NoteList
                notes={notes}
                onEdit={handleEdit}
                onDelete={deleteNote}
                onTogglePin={togglePin}
                loading={loading}
                isSubmitting={isSubmitting}
            />

            {/* Modal Form */}
            <NoteForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleSubmitNote}
                initialData={editingNote}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}

export default NotesSection;
