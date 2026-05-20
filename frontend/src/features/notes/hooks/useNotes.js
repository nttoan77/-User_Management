// src/features/notes/hooks/useNotes.js
import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/noteService';

const useNotes = (applicationId = null) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ==================== FETCH NOTES ====================
    const fetchNotes = useCallback(async () => {
        if (!applicationId) {
            setNotes([]);
            setError(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await noteService.getNotes(applicationId);
            setNotes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Lỗi khi lấy danh sách notes theo application:', err);
            setError(err.response?.data?.message || 'Không thể tải ghi chú. Vui lòng thử lại sau.');
            setNotes([]);
        } finally {
            setLoading(false);
        }
    }, [applicationId]);

    // ==================== ADD NOTE ====================
    const addNote = useCallback(
        async (noteData) => {
            if (!applicationId) throw new Error('applicationId is required');

            try {
                setIsSubmitting(true);

                const newNote = await noteService.createNote({
                    ...noteData,
                    applicationId, // Đảm bảo truyền applicationId
                });

                setNotes((prev) => [newNote, ...prev]);
                return newNote;
            } catch (err) {
                console.error('❌ Lỗi khi thêm note:', err);
                setError(err.response?.data?.message || 'Không thể tạo ghi chú');
                throw err;
            } finally {
                setIsSubmitting(false);
            }
        },
        [applicationId],
    );

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
            console.error('❌ Lỗi khi cập nhật note:', err);
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

            setNotes((prev) => prev.filter((note) => note._id !== noteId && note.id !== noteId));
        } catch (err) {
            console.error('❌ Lỗi khi xóa note:', err);
            setError(err.response?.data?.message || 'Không thể xóa ghi chú');
            throw err;
        }
    }, []);

    // ==================== TOGGLE PIN (DÙNG ROUTE RIÊNG) ====================
    const togglePin = useCallback(async (noteId) => {
        try {
            setIsSubmitting(true);

            const updatedNote = await noteService.togglePin(noteId);

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

    // Tự động fetch khi applicationId thay đổi
    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return {
        notes,
        loading,
        error,
        isSubmitting, // Quan trọng để disable button
        fetchNotes,
        refresh,

        addNote,
        updateNote,
        deleteNote,
        togglePin,

        // Helpers
        hasNotes: notes.length > 0,
        pinnedNotes: notes.filter((note) => note.isPinned === true),
        getNoteById: (id) => notes.find((note) => note._id === id || note.id === id),
    };
};

export default useNotes;
