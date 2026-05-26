// src/features/jobs/index.js

/// ==================== COMPONENTS ====================
export { default as JobTracker } from './components/JobTracker';
export { default as KanbanBoard } from './components/KanbanBoard';
export { default as JobCard } from './components/JobCard';
export { default as JobForm } from './components/JobForm';
// export { default as JobDetailModal } from './components/JobDetailModal'; // Sau này mở ra khi cần

/// ==================== HOOKS ====================
export { default as useJobs } from './hooks/useJobs';

/// ==================== SERVICES ====================
export { jobService } from './services/jobService';

/// ==================== TYPES (nếu có) ====================
// export * from './types/jobTypes';     // Bạn có thể tạo sau

/// ==================== CONSTANTS / UTILS ====================
// export { JOB_STATUSES } from './constants/jobConstants';