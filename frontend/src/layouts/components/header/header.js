// src/components/Header/Header.jsx
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBars } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import style from './header.module.scss';
import listHeader from './listHeader';
import useClickOutside from '~/hooks/useClickOutside';

const cx = classNames.bind(style);

function Header({ scrollToSection }) {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(listHeader.AboutMe);
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // SỬA Ở ĐÂY: Dùng 1 ref cho toàn bộ Select (bao gồm cả options)
  const selectRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useClickOutside([selectRef, mobileMenuRef], () => {
    setIsOpenSelect(false);
    setIsMobileMenuOpen(false);
  });

  const options = [
    { label: listHeader.AboutMe, value: 'AboutMeRef' },
    { label: listHeader.Education, value: 'EducationRef' },
    { label: listHeader.Experience_Projects, value: 'ExperienceProjectsRef' },
    { label: listHeader.ProfessionalSkill, value: 'ProfessionalSkillRef' },
  ];

  const handleSelect = (option) => {
    setSelected(option.label);
    setIsOpenSelect(false);
    setIsMobileMenuOpen(false);
    scrollToSection(option.value);
  };

  const toggleSelect = (e) => {
    e.stopPropagation();
    setIsOpenSelect((prev) => !prev);
    setIsMobileMenuOpen(false);        // Đóng mobile khi mở desktop
  };

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setIsMobileMenuOpen((prev) => !prev);
    setIsOpenSelect(false);            // Đóng desktop khi mở mobile
  };

  return (
    <header className={cx('wrapper')}>
      {/* Left Section */}
      <div className={cx('left-section')}>
        <button
          onClick={() => navigate('/choose-cv')}
          className={cx('home-btn')}
          aria-label="Trang chủ"
        >
          <FontAwesomeIcon icon={faHome} />
        </button>

        <button
          className={cx('mobile-menu-btn')}
          onClick={toggleMobileMenu}
          aria-label="Mở menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* ==================== DESKTOP CUSTOM SELECT ==================== */}
      <div className={cx('select-wrapper')} ref={selectRef}>   {/* ← Ref ở đây */}
        <div
          className={cx('custom-select', { open: isOpenSelect })}
          onClick={toggleSelect}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleSelect(e);
            }
          }}
        >
          <span className={cx('selected-text')}>{selected}</span>
          <span className={cx('arrow')} />
        </div>

        {/* Options nằm cùng cấp với custom-select nhưng vẫn trong selectRef */}
        {isOpenSelect && (
          <div className={cx('options')}>
            {options.map((opt) => (
              <div
                key={opt.value}
                className={cx('option', { active: selected === opt.label })}
                onClick={() => handleSelect(opt)}     // ← Không cần stopPropagation nữa
                role="button"
                tabIndex={0}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================== MOBILE MENU ==================== */}
      {isMobileMenuOpen && (
        <div className={cx('mobile-menu')} ref={mobileMenuRef}>
          <div className={cx('mobile-options')}>
            {options.map((opt) => (
              <div
                key={opt.value}
                className={cx('mobile-option', { active: selected === opt.label })}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;