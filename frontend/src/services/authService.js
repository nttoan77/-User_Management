import httpRequest, { post } from '~/utils/httpRequest';

// export const login = async (identifier, password) => {
//     try {
//         const res = await httpRequest.post('api/auth/login', {
//             identifier, // ← backend nhận đúng field này
//             password,
//         });
//         return res.data; // { token, user, message }
//     } catch (err) {
//         throw err.response?.data || { message: 'Đăng nhập thất bại!' };
//     }
// };

export const login = async (identifier, password) => {
    // console.log('Đang gọi login với:', { identifier, password });

    try {
        const res = await httpRequest.post('api/auth/login', { identifier, password });
        
        // console.log('Response từ backend:', res);           // XEM CÁI NÀY
        // console.log('res.data là:', res.data);               // XEM CÁI NÀY
        // console.log('res.data.token:', res.data?.token);     // XEM CÁI NÀY
        // console.log('res.data.user:', res.data?.user);

        return res.data; // BẮT BUỘC CÓ RETURN Ở ĐÂY!!!
        
    } catch (error) {
        console.error('Lỗi từ backend:', error.response?.data || error);
        throw error;
    }
};
export const register = async ({ email, phone, password, configPassword }) => {
    try {
        const res = await httpRequest.post('api/auth/register', {
            email,
            phone,
            password,
            configPassword: configPassword,
        });
        return res.data; // backend trả về { token, user } hoặc thông báo
    } catch (err) {
        throw err.response?.data || { message: 'Đăng ký thất bại!' };
    }
};

export const logout = () => localStorage.removeItem('token');

export const isAuthenticated = () => !!localStorage.getItem('token');

const authService = { login, register, logout, isAuthenticated };
export default authService;
