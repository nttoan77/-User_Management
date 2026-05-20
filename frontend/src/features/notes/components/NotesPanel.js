// src/features/notes/components/NotesPanel.js
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../styles/NotesPanel.module.scss';

import NoteList from './NoteList/NoteList';
import NoteForm from './NoteForm/NoteForm';

const cx = classNames.bind(styles);

function NotesPanel({
    applicationId,
    notes = [],
    onAddNote,
    onUpdateNote,
    onDeleteNote,
    onTogglePin, // Ưu tiên dùng hàm toggle riêng nếu có
    loading = false,
    isSubmitting = false,
}) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    // Mở form thêm mới
    const handleAddClick = () => {
        setEditingNote(null);
        setIsFormOpen(true);
    };

    // Mở form chỉnh sửa
    const handleEdit = (note) => {
        setEditingNote(note);
        setIsFormOpen(true);
    };

    // Xử lý submit từ NoteForm
    const handleSubmitNote = async (noteData, noteId = null) => {
        try {
            if (noteId) {
                // Cập nhật
                await onUpdateNote(noteId, noteData);
            } else {
                // Tạo mới
                await onAddNote({
                    ...noteData,
                    applicationId, // Quan trọng: gán applicationId
                });
            }

            setIsFormOpen(false);
            setEditingNote(null);
        } catch (error) {
            console.error('❌ Lỗi lưu ghi chú:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu ghi chú!');
        }
    };

    // Toggle Pin - Ưu tiên dùng hàm riêng nếu được truyền vào
    const handleTogglePin = async (noteId) => {
        if (onTogglePin) {
            await onTogglePin(noteId); // Dùng hàm toggle chuyên dụng
        } else {
            // Fallback: dùng updateNote
            const note = notes.find((n) => n._id === noteId || n.id === noteId);
            if (note) {
                await onUpdateNote(noteId, { isPinned: !note.isPinned });
            }
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingNote(null);
    };

    return (
        <div className={cx('notes-panel')}>
            <div className={cx('panel-header')}>
                <h3>Ghi chú ứng tuyển</h3>
                <button className={cx('add-btn')} onClick={handleAddClick} disabled={isSubmitting}>
                    + Thêm ghi chú
                </button>
            </div>

            <NoteList
                notes={notes}
                onEdit={handleEdit}
                onDelete={onDeleteNote}
                onTogglePin={handleTogglePin}
                loading={loading}
                isSubmitting={isSubmitting}
            />

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

export default NotesPanel;
