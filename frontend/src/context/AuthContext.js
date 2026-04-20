// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Khi app load (F5 trang) → đọc user từ localStorage
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (savedUser && token) {
                setUser(JSON.parse(savedUser));
            }
        } catch (err) {
            console.error('Lỗi parse user từ localStorage');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm login – bắt buộc phải có!
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData); // Quan trọng: cập nhật ngay vào Context
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, loginUser: login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
