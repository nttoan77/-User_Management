// src/features/notes/hooks/useGeneralNotes.js
import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/noteService';

const useGeneralNotes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái submit (add/update)

    // ==================== FETCH NOTES ====================
    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await noteService.getNotes(); // General notes (không truyền applicationId)

            setNotes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Lỗi tải ghi chú chung:', err);
            setError(err.response?.data?.message || 'Không thể tải danh sách ghi chú');
            setNotes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== ADD NOTE ====================
    const addNote = useCallback(async (noteData) => {
        try {
            setIsSubmitting(true);
            const newNote = await noteService.createNote(noteData);

            // Optimistic update + thêm vào đầu danh sách
            setNotes((prev) => [newNote, ...prev]);
            return newNote;
        } catch (err) {
            console.error('❌ Lỗi thêm ghi chú:', err);
            setError(err.response?.data?.message || 'Không thể tạo ghi chú');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // ==================== UPDATE NOTE ====================
    const updateNote = useCallback(async (noteId, updatedData) => {
        try {
            setIsSubmitting(true);
            const updated = await noteService.updateNote(noteId, updatedData);

            setNotes((prev) =>
                prev.map((note) => (note._id === noteId || note.id === noteId ? { ...note, ...updated } : note)),
            );
            return updated;
        } catch (err) {
            console.error('❌ Lỗi cập nhật ghi chú:', err);
            setError(err.response?.data?.message || 'Không thể cập nhật ghi chú');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // ==================== DELETE NOTE ====================
    const deleteNote = useCallback(async (noteId) => {
        try {
            await noteService.deleteNote(noteId);

            // Optimistic delete
            setNotes((prev) => prev.filter((note) => note._id !== noteId && note.id !== noteId));
        } catch (err) {
            console.error('❌ Lỗi xóa ghi chú:', err);
            setError(err.response?.data?.message || 'Không thể xóa ghi chú');
            throw err;
        }
    }, []);

    // ==================== TOGGLE PIN (SỬ DỤNG ROUTE RIÊNG) ====================
    const togglePin = useCallback(async (noteId) => {
        try {
            setIsSubmitting(true);

            // Gọi API toggle-pin riêng
            const updatedNote = await noteService.togglePin(noteId);

            // Cập nhật state
            setNotes((prev) =>
                prev.map((note) => (note._id === noteId || note.id === noteId ? { ...note, ...updatedNote } : note)),
            );

            return updatedNote;
        } catch (err) {
            console.error('❌ Lỗi toggle pin:', err);
            setError(err.response?.data?.message || 'Không thể thay đổi trạng thái ghim');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // ==================== REFRESH ====================
    const refresh = fetchNotes;

    // Load dữ liệu khi mount
    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return {
        notes,
        loading,
        error,
        isSubmitting, // Dùng để disable button khi đang submit
        fetchNotes,
        refresh,
        addNote,
        updateNote,
        deleteNote,
        togglePin,

        // Helper functions
        getNoteById: (id) => notes.find((note) => note._id === id || note.id === id),
    };
};

export default useGeneralNotes;
