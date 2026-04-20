// ~/utils/httpRequest.js – PHIÊN BẢN HOÀN HẢO, UPLOAD ẢNH MƯỢT 100%
import axios from 'axios';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:8888',
    // KHÔNG ĐẶT Content-Type Ở ĐÂY NỮA!!!
});

// Tự động gắn token + XỬ LÝ Content-Type THÔNG MINH
httpRequest.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // QUAN TRỌNG NHẤT: Nếu là FormData → để axios tự set multipart + boundary
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type']; // xóa để axios tự thêm đúng boundary
        // HOẶC có thể để trống cũng được
    } else {
        config.headers['Content-Type'] = 'application/json'; // chỉ dùng cho JSON
    }

    return config;
});

// Xử lý lỗi chung
httpRequest.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('HTTP Error:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; // chuyển về login
        }
        return Promise.reject(error);
    },
);

// Các hàm tiện ích
export const get = async (path, options = {}) => {
    const response = await httpRequest.get(path, options);
    return response.data;
};

export const post = async (path, data = {}, options = {}) => {
    const response = await httpRequest.post(path, data, options);
    return response.data;
};

export const put = async (path, data = {}, options = {}) => {
    const response = await httpRequest.put(path, data, options);
    return response.data;
};

export const del = async (path, options = {}) => {
    const response = await httpRequest.delete(path, options);
    return response.data;
};

export default httpRequest;
