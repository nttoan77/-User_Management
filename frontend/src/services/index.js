import * as auth from './authService';
import * as cv from './cvService';
import * as user from './userService';

// Gom tất cả service thành 1 object
const api = {
    auth,
    cv,
    user,
};

export default api;
