// src/pages/Login/Login.jsx
import classNames from 'classnames/bind';
import style from './Login.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faSpinner, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef } from 'react';
import { login } from '~/services/authService';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(style);

function Login({ setUser }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const handleLogin = async (e) => {
        e?.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!identifier.trim()) return setError('Vui lòng nhập email hoặc số điện thoại');
            if (!password.trim()) return setError('Vui lòng nhập mật khẩu');

            // GỌI API + NHẬN { token, user } luôn
            const { token, user } = await login(identifier.trim(), password.trim());

            // CHỈ CẦN 1 DÒNG DUY NHẤT – ĐÃ LÀM HẾT MỌI VIỆC!
            loginUser(user, token); // ← lưu localStorage + cập nhật Context

            if (setUser) setUser(user);

            // Redirect thông minh
            if (!user.isProfileComplete) {
                navigate('/register-information-user', { replace: true });
            } else {
                navigate('/my-profile-page', { replace: true });
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            const msg = error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // NHẤN ENTER = ĐĂNG NHẬP – GIỮ NGUYÊN
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleLogin();
        }
    };

    return (
        <div className={cx('login')}>
            <form className={cx('wrapper')} onSubmit={handleLogin} onKeyDown={handleKeyDown}>
                <div className={cx('header')}>Đăng nhập</div>

                <div className={cx('main')}>
                    <div className={cx('m-item')}>
                        {/* Email / Phone */}
                        <div className={cx('m-item-item')}>
                            <div className={cx('m-item-content')}>Email hoặc số điện thoại</div>
                            <div className={cx('m-item-input')}>
                                <input
                                    className={cx('m-item-input-input')}
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="Nhập email hoặc số điện thoại"
                                    disabled={loading}
                                    autoFocus
                                    ref={inputRef}
                                />
                                {identifier ? (
                                    <FontAwesomeIcon
                                        className={cx('m-item-input-icon', 'clear')}
                                        icon={faCircleXmark}
                                        onClick={() => {
                                            setIdentifier('');
                                            inputRef.current?.focus(); // ✅ focus lại input
                                        }}
                                    />
                                ) : (
                                    <FontAwesomeIcon className={cx('m-item-input-icon')} icon={faCircleUser} />
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className={cx('m-item-item')}>
                            <div className={cx('m-item-content')}>Mật khẩu</div>
                            <div className={cx('m-item-input')}>
                                <input
                                    className={cx('m-item-input-input')}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thông báo lỗi */}
                {error && <div className={cx('error-message')}>{error}</div>}

                {/* Nút đăng nhập */}
                <div className={cx('footer')}>
                    <div className={cx('f-btn')}>
                        <button className={cx('f-btn-btn', { loading })} type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: 8 }} />
                                    Đang đăng nhập...
                                </>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </div>

                    <div className={cx('f-clause')}>
                        <Link to="/forget">
                            <button type="button" className={cx('f-clause-btn', 'forget')}>
                                Quên mật khẩu?
                            </button>
                        </Link>
                        <Link to="/register">
                            <button type="button" className={cx('f-clause-btn', 'register')}>
                                Đăng ký tài khoản
                            </button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;
