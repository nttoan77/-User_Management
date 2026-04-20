// import React, { useEffect, useState } from 'react';
// import classNames from 'classnames/bind';
// import Style from './ScrollToTopButton.module.scss';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleUp } from '@fortawesome/free-solid-svg-icons';

// const cx = classNames.bind(Style);
// const ScrollToTopButton = () => {
//     const [showButton, setShowButton] = useState(false);
//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollY = window.scrollY;
//             setShowButton(scrollY > 100); // Hiện nút khi cuộn hơn 100px
//         };
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);
//     const scrollToTop = () => {
//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth',
//         });
//     };
//     return (
//         showButton && (
//             <button onClick={scrollToTop} className={cx('button')} title="Trở về đầu trang">
//                 <FontAwesomeIcon icon={faCircleUp} />
//             </button>
//         )
//     );
// };
// export default ScrollToTopButton;


// src/components/ScrollToTopButton/ScrollToTopButton.jsx
import React, { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import Style from './ScrollToTopButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Style);

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    // Dùng useCallback để tránh tạo hàm mới liên tục
    const handleScroll = useCallback(() => {
        // Kiểm tra scroll của cả window và document (an toàn hơn)
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        setShowButton(scrollY > 300); // Tăng lên 300px cho tự nhiên hơn
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Kiểm tra ngay khi mount (trường hợp đã scroll sẵn)
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!showButton) return null;

    return (
        <button
            onClick={scrollToTop}
            className={cx('button')}
            title="Trở về đầu trang"
            aria-label="Trở về đầu trang"
        >
            <FontAwesomeIcon icon={faCircleUp} />
        </button>
    );
};

export default ScrollToTopButton;