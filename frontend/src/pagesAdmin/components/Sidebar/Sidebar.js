
// import React, { useEffect, useState } from 'react';
// import classNames from 'classnames/bind';
// import styles from './Sidebar.module.scss';
// import { useNavigate, useLocation } from 'react-router-dom';

// import defaultAvatar from '~/assets/images/img-error.jpg';

// const cx = classNames.bind(styles);

// const Sidebar = ({ setPage, page }) => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             try {
//                 const parsed = JSON.parse(storedUser);
//                 // console.log('🟢 User data:', parsed);
//                 // console.log('🟢 Full avatar URL sẽ là:', `${process.env.REACT_APP_BASE_URL}${parsed.avatar}`);
//                 setCurrentUser(parsed);
//             } catch (error) {
//                 console.error('❌ Lỗi parse user:', error);
//             }
//         }
//     }, []);

//     const avatarSrc = currentUser?.avatar
//         ? `${process.env.REACT_APP_BASE_URL}${currentUser.avatar.startsWith('/') ? '' : '/'}${currentUser.avatar}`
//         : defaultAvatar;

//     return (
//         <aside className={cx('sidebar')}>
//             <div className={cx('header')}>
//                 <div className={cx('avatar')}>
//                     <img
//                         src={avatarSrc}
//                         alt="Avatar người dùng"
//                         className={cx('logo-avatar')}
//                         onError={(e) => {
//                             console.warn('Avatar load lỗi, fallback về default:', avatarSrc);
//                             e.target.onerror = null;
//                             e.target.src = defaultAvatar;
//                         }}
//                     />
//                 </div>
//                 <h2 className={cx('name-user')}>{currentUser?.nameUser || currentUser?.name || 'Admin'}</h2>
//             </div>

//             <nav className={cx('main')}>
//                 <ul className={cx('content-ul')}>
//                     <li className={cx('content-li', { active: true })}>Người dùng</li>
//                     <li className={cx('content-li')}>Thống kê</li>
//                     <li className={cx('content-li')}>Cài đặt</li>
//                 </ul>
//             </nav>
//         </aside>
//     );
// };

// export default Sidebar;

// ==================
// components/Admin/Sidebar/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import defaultAvatar from '~/assets/images/img-error.jpg';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
  { id: 'users',     label: 'Người dùng' },
  { id: 'statistics', label: 'Thống kê'   },
  { id: 'settings',   label: 'Cài đặt'    },
  // sau này thêm: 'products', 'orders', 'reviews', ...
];

const Sidebar = ({ currentPage, onChangePage }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (err) {
        console.error('Parse user error:', err);
      }
    }
  }, []);

  const avatarSrc = currentUser?.avatar
    ? `${process.env.REACT_APP_BASE_URL}${currentUser.avatar.startsWith('/') ? '' : '/'}${currentUser.avatar}`
    : defaultAvatar;

  return (
    <aside className={cx('sidebar')}>
      <div className={cx('header')}>
        <div className={cx('avatar')}>
          <img
            src={avatarSrc}
            alt="Avatar"
            className={cx('logo-avatar')}
            onError={(e) => (e.target.src = defaultAvatar)}
          />
        </div>
        <h2 className={cx('name-user')}>
          {currentUser?.nameUser || currentUser?.name || 'Admin'}
        </h2>
      </div>

      <nav className={cx('main')}>
        <ul className={cx('content-ul')}>
          {MENU_ITEMS.map((item) => (
            <li
              key={item.id}
              className={cx('content-li', { active: currentPage === item.id })}
              onClick={() => onChangePage(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;