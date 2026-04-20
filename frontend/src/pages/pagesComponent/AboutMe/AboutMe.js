import classNames from 'classnames/bind';
import style from './AboutMe.module.scss';
import useInView from '~/components/hooks/useInView';
import ITCanvas from './ITCanvas';

const cx = classNames.bind(style);

function AboutMe({ data }) {
    const [ref, inView] = useInView(0.2);

    if (!data) {
        return (
            <div className={cx('loading')}>
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    // SỬA LỖI: Ưu tiên about (chi tiết) → careerGoal → fallback
    const introductionText =
        data.about?.trim() ||
        data.careerGoal?.trim() ||
        'Chưa có thông tin giới thiệu bản thân hoặc mục tiêu nghề nghiệp.';

    const hasIntroduction = introductionText !== 'Chưa có thông tin giới thiệu bản thân hoặc mục tiêu nghề nghiệp.';

    return (
        <section ref={ref} className={cx('wrapper', { animate: inView })}>
            {/* Phần TEXT - Giới thiệu */}
            <div className={cx('content')}>
                {/* Tiêu đề chính */}
                <div className={cx('header')}>
                    {data.jobPosition ? (
                        <h1 className={cx('jobTitle')}> Vị trí ứng tuyển: {data.jobPosition}</h1>
                    ) : (
                        <h1 className={cx('jobTitle', 'placeholder')}>Chưa có vị trí ứng tuyển</h1>
                    )}
                </div>

                {/* Nội dung giới thiệu */}
                <div className={cx('textBox')}>
                    <p className={cx('text', { noData: !hasIntroduction })}>{introductionText}</p>

                    {/* Gợi ý khi chưa có nội dung */}
                    {!hasIntroduction && (
                        <span className={cx('placeholderHint')}>
                            Hãy thêm phần "Giới thiệu bản thân" hoặc "Mục tiêu nghề nghiệp" để phần này ấn tượng hơn!
                        </span>
                    )}
                </div>

                {/* Website nếu có */}
                {data.website && (
                    <div className={cx('website')}>
                        <a
                            href={data.website.startsWith('http') ? data.website : `https://${data.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cx('websiteLink')}
                        >
                            🌐 {data.website.replace(/^https?:\/\//, '')}
                        </a>
                    </div>
                )}
            </div>

            {/* Canvas hiệu ứng */}
            {/* <div className={cx("canvas")}>
        <ITCanvas />
      </div> */}
        </section>
    );
}

export default AboutMe;
