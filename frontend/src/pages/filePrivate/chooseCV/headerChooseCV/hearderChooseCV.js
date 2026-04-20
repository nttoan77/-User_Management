import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faUser,
    faEnvelope,
    faCalendarAlt,
    faVenusMars,
    faMapMarkerAlt,
    faGear,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import style from './headerChooseCV.module.scss';
import useClickOutside from '~/hooks/useClickOutside';
import WrapperUser from '~/layouts/components/header/wrapperUser/wrapperUser';
import httpRequest from '~/utils/httpRequest';

const cx = classNames.bind(style);

function HeaderChooseCV({classnames}) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [cvList, setCvList] = useState([]);
    const [loading, setLoading] = useState(true);

    const dropdownRef = useRef();

    // Lấy user từ localStorage
    // GỌI API VÀ ĐỢI KẾT QUẢ – CHỈ 1 LẦN DUY NHẤT!
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('selectedCVId');
        setShowDropdown(false);
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // 1. LẤY THÔNG TIN USER TỪ API MỚI (có avatar, genderDisplay, v.v.)
                const userRes = await httpRequest.get('/api/auth/profile'); // ĐÚNG ROUTE
                const userData = userRes.data?.user || userRes.data;
                setUser(userData);

                // 2. LẤY DANH SÁCH CV
                // const cvRes = await httpRequest.get('/api/cv');
                // setCvList(cvRes.data?.cvs || cvRes.data || []);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu:', err);
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);
    // Đóng dropdown khi click ngoài
    useClickOutside([dropdownRef], () => setShowDropdown(false));
    return (
        <header className={cx('header',classnames)}>
            <div className={cx('user-greeting')}>
                <div className={cx('avatar')}>
                    {user?.avatar ? (
                        // CHỈ DÙNG NGUYÊN user.avatar → đã có full URL rồi!
                        <img src={user.avatar} alt={user.name} className={cx('avatar-img')} />
                    ) : (
                        <div className={cx('avatar-placeholder')}>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                    )}
                </div>

                <div className={cx('greeting-info')}>
                    <h2>Xin chào, {user?.name || 'Bạn'}!</h2>
                    <p>
                        <FontAwesomeIcon icon={faEnvelope} /> {user?.email || 'Chưa có email'}
                    </p>

                    {/* THÔNG TIN CÁ NHÂN ĐẸP */}
                    <div className={cx('extra-info')}>
                        {user?.birthDay && (
                            <span className={cx('info-item')}>
                                <FontAwesomeIcon icon={faCalendarAlt} /> {user.birthDay}
                            </span>
                        )}
                        {user?.genderDisplay && (
                            <span className={cx('info-item')}>
                                <FontAwesomeIcon icon={faVenusMars} /> {user.genderDisplay}
                            </span>
                        )}
                        {user?.addressDisplay && user.addressDisplay !== 'Chưa cập nhật' && (
                            <span className={cx('info-item')}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> {user.addressDisplay}
                            </span>
                        )}
                    </div>

                    <p className={cx('welcome-text')}>
                        {user?.isProfileComplete
                            ? 'Chọn một CV để bắt đầu hành trình ứng tuyển nào!'
                            : 'Vui lòng hoàn thiện hồ sơ để tiếp tục!'}
                    </p>
                </div>
            </div>

            {/* PHẦN PHẢI: ICON BÁNH RĂNG MỞ MENU */}
            <div className={cx('user-menu')}>
                {user ? (
                    <Tippy
                        interactive
                        visible={showDropdown}
                        placement="bottom-end"
                        offset={[100, 2]}
                        onClickOutside={() => setShowDropdown(false)}
                        render={() => (
                            <div className={cx('dropdown-menu')} ref={dropdownRef}>
                                <WrapperUser user={user} onLogout={handleLogout} />
                            </div>
                        )}
                    >
                        <button className={cx('setting-btn')} onClick={() => setShowDropdown(!showDropdown)}>
                            <FontAwesomeIcon icon={faGear} />
                        </button>
                    </Tippy>
                ) : (
                    <button onClick={() => navigate('/login')} className={cx('login-btn')}>
                        Đăng nhập
                    </button>
                )}
            </div>
        </header>
    );
}

export default HeaderChooseCV;
