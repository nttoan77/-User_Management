import classNames from 'classnames/bind';
import style from './RegisterLogin.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register as registerAPI } from '~/services/authService';

const cx = classNames.bind(style);

const RegisterObj = {
    email: 'Email',
    phone: 'Số điện thoại',
    password: 'Mật khẩu',
    configPassword: 'Xác nhận mật khẩu',
};

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        configPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { email, phone, password, configPassword } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateForm = () => {
        if (!email || !phone || !password || !configPassword) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return false;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            setError('Email không hợp lệ!');
            return false;
        }

        const cleanedPhone = phone.replace(/[^0-9+]/g, '');
        const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
        if (!phoneRegex.test(cleanedPhone)) {
            setError('Số điện thoại không hợp lệ! Ví dụ: 0901234567');
            return false;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải từ 6 ký tự trở lên!');
            return false;
        }

        if (password !== configPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            setError('');

            const autoName = 'User' + Math.floor(1000 + Math.random() * 9000);

            const response = await registerAPI({
                name: autoName,
                email: email.toLowerCase().trim(),
                phone: phone.replace(/[^0-9+]/g, ''),
                password,
                configPassword,
            });

            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            alert('Đăng ký thành công!');
            navigate('/');
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('register')}>
            <form className={cx('wrapper')} onSubmit={handleRegister}>
                <div className={cx('header')}>
                    <div className={cx('header-content')}>Đăng ký tài khoản</div>
                </div>

                <div className={cx('main')}>
                    {Object.entries(RegisterObj).map(([key, label]) => (
                        <div className={cx('m-item-item')} key={key}>
                            <div className={cx('m-item-item-content')}>{label}</div>
                            <input
                                name={key}
                                type={key.includes('password') ? 'password' : key === 'email' ? 'email' : 'tel'}
                                className={cx('m-item-item-input')}
                                placeholder={label}
                                value={formData[key]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                </div>

                {error && <div className={cx('error-message')}>{error}</div>}

                <div className={cx('footer')}>
                    <Link to="/login"  className={cx('f-btn-cancel', 'f-btn')}>
                    Đăng nhập
                      
                    </Link>
                    <button
                        type="submit"
                        className={cx('f-btn-confirm', 'f-btn')}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;