// src/features/notes/index.js
// Barrel file - Export tất cả những gì cần thiết từ feature "notes"

// Components
export { default as NoteItem } from './components/NoteItem/NoteItem';
export { default as NoteList } from './components/NoteList/NoteList';
export { default as NoteForm } from './components/NoteForm/NoteForm';
export { default as NotesPanel } from './components/NotesPanel';

// Hooks
export { default as useNotes } from './hooks/useNotes';           // Dùng cho Job Tracker
export { default as useGeneralNotes } from './hooks/useGeneralNotes'; // Dùng cho Trang Home
// Services
export { noteService } from './services/noteService';

// Types (nếu sau này bạn muốn tách ra)
export * from './types/noteTypes';   // Bạn có thể tạo file này sau