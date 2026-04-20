// src/components/Admin/MainContent/AdminMain/index.js
import { lazy } from 'react';

export const AdminMainUser = lazy(() => import('./AdminMainUser/index.js'));
export const AdminMainStatistics = lazy(() => import('./AdminMainStatistics/index.js'));
export const AdminMainSettings = lazy(() => import('./AdminMainSettings/AdminMainSettings'));