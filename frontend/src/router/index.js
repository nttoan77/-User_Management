// src/router/index.jsx
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import { publicRoutes, privateRoutes } from '~/routes/routes';
import config from '~/config/routes';

import DefaultLayout from '~/layouts/defaultLayout';
import { Fragment } from 'react';

// ================= GUARDS =================
// const GuestOnly = () => {
//     const { user } = useAuth();
//     if (user) {
//         return <Navigate to={user?.isProfileComplete ? config.ChooseCV : config.RegisInformationUser} replace />;
//     }
//     return <Outlet />;
// };

const GuestOnly = () => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to={user?.isProfileComplete ? config.MyProfilePage : config.RegisInformationUser} replace />;
    }
    return <Outlet />;
};


const Protected = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to={config.Login} replace />;
    return children ?? <Outlet />;
};

// const NeedProfile = () => {
//     const { user } = useAuth();
//     const isComplete = user?.isProfileComplete === true;
//     if (isComplete) return <Navigate to={config.ChooseCV} replace />;
//     return <Outlet />;
// };

const NeedProfile = () => {
    const { user } = useAuth();
    const isComplete = user?.isProfileComplete === true;
    if (isComplete) return <Navigate to={config.MyProfilePage} replace />;
    return <Outlet />;
};

const HasProfile = () => {
    const { user } = useAuth();
    const isComplete = user?.isProfileComplete === true;
    if (!isComplete) return <Navigate to={config.RegisInformationUser} replace />;
    return <Outlet />;
};

// ================= RENDER =================
const RenderRoute = ({ route }) => {
    const Page = route.component;
    const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;
    return (
        <Layout>
            <Page />
        </Layout>
    );
};

// ================= ROUTES =================
export const appRoutes = [
    // ===== GUEST =====
    <Route key="guest" element={<GuestOnly />}>
        {publicRoutes.map((route) => (
            <Route
                key={route.path}
                index={route.path === '/'}
                path={route.path}
                element={<RenderRoute route={route} />}
            />
        ))}
    </Route>,

    // ===== ONBOARDING =====
    <Route
        key="onboarding"
        element={
            <Protected>
                <NeedProfile />
            </Protected>
        }
    >
        {privateRoutes
            .filter((r) => r.path === config.RegisInformationUser)
            .map((route) => (
                <Route key={route.path} path={route.path} element={<RenderRoute route={route} />} />
            ))}
    </Route>,

    // ===== MAIN APP =====
    <Route
        key="main"
        element={
            <Protected>
                <HasProfile />
            </Protected>
        }
    >
        {/* CV – CHỈ RENDER 1 LẦN */}
        {privateRoutes
            .filter((r) => r.path === config.routes.cv)
            .map((route) => (
                <Route key={route.path} path={route.path} element={<RenderRoute route={route} />} />
            ))}

        {/* CÁC TRANG KHÁC (❗ LOẠI CV RA) */}
        {privateRoutes
            .filter(
                (r) =>
                    r.path !== config.RegisInformationUser &&
                    // r.path !== config.home &&
                    r.path !== config.routes.cv // 🔥 DÒNG QUYẾT ĐỊNH
            )
            .map((route) => (
                <Route key={route.path} path={route.path} element={<RenderRoute route={route} />} />
            ))}
    </Route>,

    // ===== 404 =====
    <Route key="notfound" path="*" element={<Navigate to="/" replace />} />,
];
