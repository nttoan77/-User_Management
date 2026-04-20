// src/protectedRoute.jsx → SỬA THÀNH THẾ NÀY (CHUẨN PRODUCTION 100%)

import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '~/context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // Đang tải → hiện loading
    if (loading) {
        return <div>Đang xác thực...</div>;
    }

    // Chưa có user → về login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Kiểm tra cần CV không
    const requiresCV = children.props?.routeNeedsCV || false;
    const selectedCVId = localStorage.getItem('selectedCVId');

    if (requiresCV && !selectedCVId) {
        return <Navigate to="/choose-cv" replace />;
    }

    return children;
}
