import { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DefaultLayout from './layouts';
import { privateRoutes, publicRoutes } from './routes/routes';
import ProtectedRoute from './protectedRoute';
import Login from './pages/filePublic/Login/Login';

function RenderRoutes() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // tránh flash trang

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    // Cập nhật user khi đăng nhập ở tab khác
    useEffect(() => {
        const handleStorage = () => {
            const stored = localStorage.getItem('user');
            setUser(stored ? JSON.parse(stored) : null);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Hàm kiểm tra user đã có thông tin cá nhân chưa
    const hasProfile = () => {
        return user?.isProfileComplete === true;
    };

    // Render route chung
    const renderRoutes = (routes) =>
        routes.map((route) => {
            const Page = route.component;
            const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;
            const isPrivate = privateRoutes.some((r) => r.path === route.path);

            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={
                        isPrivate ? (
                            <ProtectedRoute user={user}>
                                <Layout>
                                    <Page user={user} />
                                </Layout>
                            </ProtectedRoute>
                        ) : (
                            <Layout>
                                <Page user={user} />
                            </Layout>
                        )
                    }
                />
            );
        });

    // Nếu đang load → hiện loading (tránh flash)
    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    return (
        <Router>
            <Routes>
                {/* 1. TẤT CẢ PUBLIC ROUTES */}
                {renderRoutes(publicRoutes)}

                {/* 2. TẤT CẢ PRIVATE ROUTES */}
                {renderRoutes(privateRoutes)}

                {/* 3. TRANG CHỦ "/" → LUÔN HIỆN LOGIN ĐẦU TIÊN */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 4. REDIRECT THÔNG MINH KHI ĐÃ ĐĂNG NHẬP */}
                <Route
                    path="/login"
                    element={
                        user ? (
                            user.isProfileComplete ? (
                                <Navigate to="/choose-cv" replace />
                            ) : (
                                <Navigate to="/register-information-user" replace />
                            )
                        ) : (
                            <Login />
                        )
                    }
                />

                {/* 5. BẤT KỲ ĐƯỜNG DẪN NÀO KHÁC → QUAY VỀ LOGIN */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default RenderRoutes;
