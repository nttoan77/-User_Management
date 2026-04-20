// src/pages/pagesComponent/Education/slideEducation/slideEducation.jsx
import { useState, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './slideEducation.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleArrowRight, faImage } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

/* ================= Skeleton ================= */
function SlideSkeleton() {
    return (
        <div className={cx('skeleton-wrapper')}>
            {[1, 2, 3].map((i) => (
                <div key={i} className={cx('skeleton-card')} />
            ))}
        </div>
    );
}

function SlideEducation({ data }) {
    const [activeImage, setActiveImage] = useState(null);
    /* ============ Normalize Images ============ */
    const certificateImages = useMemo(() => {
        return data.certificates
            .filter((cert) => cert.file?.mimetype?.startsWith('image/') && cert.file?.path)
            .map((cert) => {
                let url = cert.file.path.replace(/\\/g, '/');

                if (url.includes('public')) {
                    url = url.split('public')[1];
                }

                if (!url.startsWith('http')) {
                    url = `${process.env.REACT_APP_BASE_URL}/${url.replace(/^\//, '')}`;
                }

                return {
                    url,
                   
                };
            });
    }, [data]);

    /* ============ Loading ============ */
    if (!data) {
        return (
            <div className={cx('wrapper')}>
                <SlideSkeleton />
            </div>
        );
    }

    /* ============ Empty ============ */
    if (!data.certificates || data.certificates.length === 0) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('empty-state')}>
                    <FontAwesomeIcon icon={faImage} size="4x" />
                    <h3>Chưa có chứng chỉ hình ảnh</h3>
                    <p>Hãy tải lên chứng chỉ dạng JPG / PNG.</p>
                </div>
            </div>
        );
    }

    if (certificateImages.length === 0) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('empty-state')}>
                    <FontAwesomeIcon icon={faImage} size="4x" />
                    <h3>Không có ảnh hợp lệ</h3>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* ===== Animate when scroll into view ===== */}
            <motion.div
                className={cx('wrapper')}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className={cx('container')}>
                    <div className={cx("swiper-button-prev-custom swiper-button-prev", "btn")}>
                        <FontAwesomeIcon icon={faCircleArrowLeft} />
                    </div>

                    <Swiper
                        effect="coverflow"
                        centeredSlides
                        grabCursor
                        slidesPerView="auto"
                        loop={certificateImages.length > 1}
                        coverflowEffect={{
                            rotate: 0,
                            depth: 160,
                            modifier: 2,
                            slideShadows: false,
                        }}
                        pagination={{ clickable: true }}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        autoplay={certificateImages.length > 1 ? { delay: 3500, disableOnInteraction: false } : false}
                        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                        className={cx('swiper')}
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {certificateImages.map((item, index) => (
                            <SwiperSlide key={index} className={cx('slide')}>
                                <motion.div
                                    className={cx('slide-img')}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => setActiveImage(item)}
                                >
                                    <img src={item.url} alt={item.name} className={cx('image')} loading="lazy" />
                                    <div className={cx('caption')}>{item.name}</div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className={cx("swiper-button-next-custom swiper-button-next", "btn")}>
                        <FontAwesomeIcon icon={faCircleArrowRight} />
                    </div>
                </div>
            </motion.div>

            {/* ===== Modal Zoom ===== */}
            {activeImage && (
                <div className={cx('modal')} onClick={() => setActiveImage(null)}>
                    <img src={activeImage.url} alt={activeImage.name} />
                    <span className={cx('modal-caption')}>{activeImage.name}</span>
                </div>
            )}
        </>
    );
}

export default SlideEducation;
