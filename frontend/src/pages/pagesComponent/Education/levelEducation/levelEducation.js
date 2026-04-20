// src/pagesComponent/Education/Education.jsx
import { useState } from 'react';
import classNames from 'classnames/bind';
import style from './Education.module.scss';
import useInView from '~/components/hooks/useInView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faCalendarAlt,
  faTrophy,
  faBook,
  faSchool,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);

function Education({ data }) {
  const [ref, inView] = useInView(0.2);
  const [expandedId, setExpandedId] = useState(null);

  if (!data) {
    return (
      <section ref={ref} className={cx('wrapper')}>
        <div className={cx('loading')}>Đang tải dữ liệu học vấn...</div>
      </section>
    );
  }

  const educationList = Array.isArray(data) ? data : [];

  // Sắp xếp từ mới nhất đến cũ nhất
  const sortedEducation = [...educationList].sort((a, b) => {
    const endA = b.endDate || new Date();
    const endB = a.endDate || new Date();
    return new Date(endB) - new Date(endA);
  });

  const formatDate = (date) => {
    if (!date) return 'Hiện tại';
    return new Intl.DateTimeFormat('vi-VN', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (educationList.length === 0) {
    return (
      <section ref={ref} className={cx('wrapper', { animate: inView })}>
        <div className={cx('content')}>
          <h2 className={cx('title')}>
            <FontAwesomeIcon icon={faGraduationCap} /> Học vấn
          </h2>
          <div className={cx('noData')}>
            <FontAwesomeIcon icon={faSchool} className={cx('noDataIcon')} />
            <p>Chưa có thông tin học vấn</p>
            <span>Hãy thêm trường học, bằng cấp để CV hoàn thiện hơn!</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={cx('wrapper', { animate: inView })}>
      <div className={cx('content')}>
        <h2 className={cx('title')}>
          <FontAwesomeIcon icon={faGraduationCap} /> Học vấn
        </h2>

        {/* Danh sách học vấn - timeline dọc trái */}
        <div className={cx('education-list')}>
          {sortedEducation.map((edu, index) => {
            const eduId = edu._id || index;
            const isExpanded = expandedId === eduId;

            return (
              <div key={eduId} className={cx('education-item')}>
                {/* Điểm tròn + đường nối dọc trái */}
                <div className={cx('marker')}>
                  <div className={cx('dot')} />
                  {index < sortedEducation.length - 1 && <div className={cx('line')} />}
                </div>

                {/* Card chính - clickable để expand */}
                <div
                  className={cx('card', { expanded: isExpanded })}
                  onClick={() => toggleExpand(eduId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleExpand(eduId)}
                >
                  {/* Phần header - luôn hiển thị */}
                  <div className={cx('header')}>
                    <div className={cx('header-left')}>
                      <h3 className={cx('school')}>{edu.school}</h3>
                      <p className={cx('degree')}>
                        {edu.degree && <span>{edu.degree}</span>}
                        {edu.fieldOfStudy && (
                          <span className={cx('field')}> - {edu.fieldOfStudy}</span>
                        )}
                      </p>
                    </div>

                    <div className={cx('header-right')}>
                      <span className={cx('date')}>
                        <FontAwesomeIcon icon={faCalendarAlt} className={cx('date-icon')} />
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                      </span>
                      <FontAwesomeIcon
                        icon={isExpanded ? faChevronUp : faChevronDown}
                        className={cx('chevron')}
                      />
                    </div>
                  </div>

                  {/* Phần chi tiết - chỉ hiện khi expand */}
                  <div className={cx('details', { expanded: isExpanded })}>
                    {edu.description && (
                      <p className={cx('description')}>{edu.description}</p>
                    )}

                    {edu.subjects?.length > 0 && (
                      <div className={cx('info-row')}>
                        <FontAwesomeIcon icon={faBook} />
                        <div>
                          <strong>Môn học nổi bật:</strong>
                          <div className={cx('tags')}>
                            {edu.subjects.map((sub, i) => (
                              <span key={i} className={cx('tag')}>
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {edu.achievements?.length > 0 && (
                      <div className={cx('info-row')}>
                        <FontAwesomeIcon icon={faTrophy} />
                        <div>
                          <strong>Thành tích:</strong>
                          <ul className={cx('achievements-list')}>
                            {edu.achievements.map((ach, i) => (
                              <li key={i}>{ach}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Education;