import classNames from 'classnames/bind';
import style from './wrapperUser.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const cx = classNames.bind(style);

function WrapperUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('item')}>
        <Link to="/registerInform">
          <div className={cx('content')}>Chữa thông tin cá nhân</div>
        </Link>
        <div className={cx('content')}>Thêm hồ sơ cá nhân</div>
        <Link to="/regisInformation">
          <div className={cx('content')}>Thêm thông tin hồ sơ</div>
        </Link>

     
        {user?.role === 'admin' && (
          <Link to="/admin">
            <div className={cx('content')}>
              Trang quản trị
            </div>
          </Link>
        )}

        <div className={cx('share-info')}>
          <div className={cx('share-info-1')}></div>
        </div>

        <div className={cx('content-log-out')} onClick={handleLogout}>
          Đăng xuất hồ sơ
        </div>
      </div>
    </div>
  );
}

export default WrapperUser;
