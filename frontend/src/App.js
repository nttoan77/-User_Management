import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Fragment, useContext, Suspense } from 'react';
import { AuthContext } from './context/AuthContext';
import { publicRoutes, privateRoutes } from './routes';
import DefaultLayout from './layouts/defaultLayout';
import ProtectedRoute from './protectedRoute';
import config from './config';

const getLayout = (route) => (route.layout === null ? Fragment : route.layout || DefaultLayout);

function AppRoutes() {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    return (
        <Routes>
            {publicRoutes.map((route, idx) => {
                const Page = route.component;
                const Layout = getLayout(route);
                return (
                    <Route
                        key={idx}
                        path={route.path}
                        element={
                            <Layout>
                                <Page />
                            </Layout>
                        }
                    />
                );
            })}

            {privateRoutes.map((route, idx) => {
                const Page = route.component;
                const Layout = getLayout(route);
                return (
                    <Route
                        key={idx}
                        path={route.path}
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Page />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                );
            })}

            <Route
                path="/"
                element={
                    user ? (
                        <Navigate to="/login" state={{ from: location }} replace />
                    ) : (
                        <Navigate to="/choose-cv" replace />
                    )
                }
            />
        </Routes>
    );
}

function App() {
    const { loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    return (
        <Suspense fallback={<div>Loading page...</div>}>
            <AppRoutes />
        </Suspense>
    );
}

export default App;
