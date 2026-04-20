import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import style from './CV.module.scss';

import AboutMe from '../../pagesComponent/AboutMe/AboutMe';
import Education from '../../pagesComponent/Education/Education';
import Experience from '../../pagesComponent/Experience/Experience';
import ProfessionalSkill from '../../pagesComponent/ProfessionalSkill/ProfessionalSkill';
import ScrollToTopButton from '~/components/ScrollToTopButton/ScrollToTopButton';
import { useScroll } from '~/contexts/ScrollContext';
import SlideEducation from '~/pages/pagesComponent/Education/slideEducation/slideEducation';

import httpRequest from '~/utils/httpRequest';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(style);

function CV() {
  const { sectionRefs } = useScroll();
  const { id: urlId } = useParams(); // ★★★ ĐÃ CHỮA ★★★: Luôn lấy ID từ URL trước tiên
  const navigate = useNavigate();

  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔒 CHẶN FETCH LẶP (React 18 StrictMode)
  const hasFetched = useRef(false);

  useEffect(() => {
    // console.group('🧭 [CV] useEffect START');

    let selectedCVId = urlId; // ★★★ ĐÃ CHỮA ★★★: ƯU TIÊN ID TỪ URL (không dùng localStorage nữa)

    // Nếu URL không có ID hợp lệ → redirect
    if (!selectedCVId || selectedCVId.length !== 24) {
      // console.warn('❌ Không có CV ID hợp lệ từ URL → redirect /choose-cv');
      navigate('/choose-cv');
      return;
    }

    // ⛔ React StrictMode gọi effect 2 lần (DEV)
    if (hasFetched.current) {
      // console.log('⛔ [DEV] Skip fetch CV (StrictMode)');
      return;
    }

    hasFetched.current = true;
    // console.log('✅ Bắt đầu fetch CV với ID từ URL:', selectedCVId);

    const fetchCV = async () => {
      try {
        const res = await httpRequest.get(`/api/cv/${selectedCVId}`);
        const data = res.data?.data || res.data;

        // console.log('✅ CV DATA nhận được:', data);
        setCvData(data);
      } catch (err) {
        console.error('🔥 Lỗi fetch CV:', err);
        navigate('/choose-cv');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();

    // ★★★ ĐÃ CHỮA ★★★: Xóa localStorage cũ để tránh lặp lỗi sau này (tùy chọn)
    localStorage.removeItem('selectedCV');
  }, [urlId, navigate]); // ★★★ ĐÃ CHỮA ★★★: Dependency có urlId → refetch khi ID URL thay đổi

  if (loading) {
    return <div className={cx('loading')}>Đang tải CV...</div>;
  }

  if (!cvData) {
    return <div className={cx('loading')}>Không có dữ liệu CV</div>;
  }

  const {
    education = [],
    workExperiences = [],
    skills = [],
  } = cvData;

  return (
    <div className={cx('wrapper')}>
      <section ref={sectionRefs.AboutMeRef}
      id="aboutme" className={cx('item')}>
        <AboutMe data={cvData} />
      </section>

      <section ref={sectionRefs.EducationRef} className={cx('item')}>
        <Education data={education} />
        <SlideEducation data={cvData} />
      </section>

      <section ref={sectionRefs.ExperienceProjectsRef} className={cx('item')}>
        <Experience data={workExperiences} />
      </section>

      <section ref={sectionRefs.ProfessionalSkillRef} className={cx('item')}>
        <ProfessionalSkill data={skills} />
      </section>

      <ScrollToTopButton />
    </div>
  );
}

export default CV;