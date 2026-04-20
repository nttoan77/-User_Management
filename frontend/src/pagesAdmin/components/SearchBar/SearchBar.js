// import React, { useState } from 'react';
// import classNames from 'classnames/bind';
// import styles from './SearchBar.module.scss';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';

// const cx = classNames.bind(styles);

// const SearchBar = ({ onSearch }) => {
//   const [query, setQuery] = useState('');

//   const handleChange = (e) => {
//     const value = e.target.value;
//     setQuery(value);
//     onSearch(value); // Gọi callback truyền từ Admin.js
//   };

//   return (
//     <div className={cx('search-container')}>
//       <input
//         type="text"
//         value={query}
//         onChange={handleChange}
//         placeholder="Tìm kiếm người dùng..."
//         className={cx('search-input')}
//       />
//       <FontAwesomeIcon icon={faSearch} className={cx('icon')} />
//     </div>
//   );
// };

// export default SearchBar;


// ============================
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './SearchBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  // Debounce để tránh gọi API quá nhiều khi gõ nhanh
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query.trim()); // trim để loại bỏ khoảng trắng thừa
    }, 400); // 400ms – có thể điều chỉnh 300-500ms

    return () => clearTimeout(timer); // cleanup khi thay đổi query hoặc unmount
  }, [query, onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    // Không gọi onSearch trực tiếp nữa, để debounce xử lý
  };

  const handleClear = () => {
    setQuery('');
    onSearch(''); // reset search ngay lập tức
  };

  return (
    <div className={cx('search-container')}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
        className={cx('search-input')}
        aria-label="Tìm kiếm người dùng"
      />

      {/* Icon search ở bên trái hoặc phải tùy style SCSS */}
      <FontAwesomeIcon icon={faSearch} className={cx('search-icon')} />

      {/* Icon clear chỉ hiện khi có text */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className={cx('clear-btn')}
          aria-label="Xóa tìm kiếm"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;