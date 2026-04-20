import { useState } from 'react';
import classNames from 'classnames/bind';
import style from './Experience.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useInView from '~/components/hooks/useInView';

const cx = classNames.bind(style);

function Experience({ data }) {
    const [ref, inView] = useInView(0.3);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    if (!data) return <div>Đang tải dữ liệu CV...</div>;

    // ✅ Lấy đúng workExperiences từ cvProfiles
    const experiences = Array.isArray(data) ? data : [];

    const handleSelect = (index) => {
        if (selectedIndex === index) {
            handleClose();
        } else {
            setSelectedIndex(index);
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedIndex(null);
            setIsClosing(false);
        }, 300);
    };

    return (
        <div ref={ref} className={cx('wrapper', { animate: inView })}>
            {/* 🔹 Tiêu đề */}
            <div className={cx('header')}>
                <h2>Kinh nghiệm làm việc</h2>
                <p>Những vị trí, vai trò và thành tựu tôi đã đạt được trong hành trình sự nghiệp.</p>
            </div>

            {/* 📘 Danh sách kinh nghiệm */}
            <div className={cx('timeline')}>
                {experiences.length === 0 ? (
                    <p className={cx('empty')}>Chưa có dữ liệu kinh nghiệm làm việc.</p>
                ) : (
                    experiences.map((item, index) => (
                        <div key={index} className={cx('experience-item')}>
                            <div
                                className={cx('summary', { active: selectedIndex === index })}
                                onClick={() => handleSelect(index)}
                            >
                                <h4>{item.position}</h4>
                                <p className={cx('company')}>{item.company}</p>
                                <p className={cx('time')}>
                                    {item.startDate} – {item.endDate || 'Hiện tại'}
                                </p>
                            </div>

                            {selectedIndex === index && (
                                <div className={cx('detail', { closing: isClosing })}>
                                    <button className={cx('close-btn')} onClick={handleClose}>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>

                                    <div className={cx('detail-content')}>
                                        {/* <h4>{item.position}</h4>
                                        <p className={cx('company')}>{item.company}</p>
                                        <p className={cx('time')}>
                                            {item.startDate} – {item.endDate || 'Hiện tại'}
                                        </p> */}

                                        <div className={cx('desc-block')}>
                                            <h5>Mô tả</h5>
                                            <p>{item.description || 'Không có mô tả'}</p>
                                        </div>

                                        <div className={cx('desc-block')}>
                                            <h5>Thành tựu</h5>

                                            {/* achievements có thể là mảng hoặc chuỗi */}
                                            {Array.isArray(item.achievements) ? (
                                                <ul>
                                                    {item.achievements.map((ach, i) => (
                                                        <li key={i}>{ach}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>{item.achievements || 'Không có dữ liệu'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Experience;
