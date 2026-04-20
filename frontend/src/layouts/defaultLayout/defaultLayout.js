// // import PropTypes from 'prop-types';
// import classNames from 'classnames/bind';
// import Header from '../../layouts/components/header/header';
// // import Sidebar from '~/layouts/components/Sidebar';
// import styles from './defaultLayout.module.scss';
// import { useRef } from 'react';
// // import Home from '~/pages/filePrivate/CV/CV';

// const cx = classNames.bind(styles);

// function DefaultLayout({ children }) {
//     const sectionRefs = {
//         IntroduceRef: useRef(null),
//         AboutMeRef: useRef(null),
//         ExperienceProjectsRef: useRef(null),
//         EducationRef: useRef(null),
//         ProfessionalSkillRef: useRef(null),
//     };

//     const scrollToSection = (key) => {
//         if (sectionRefs[key]?.current) {
//             sectionRefs[key].current.scrollIntoView({ behavior: 'smooth' });
//         }
//     };

//     return (
//         <div className={cx('wrapper')}>
//             <div className={cx('header')}>
//                 <Header scrollToSection={scrollToSection} />
//             </div>
//             <div className={cx('container')}>
//                 {/* <Home refs={sectionRefs} /> */}
//                 <div className={cx('content')}>{children}</div>
//             </div>
//         </div>
//     );
// }
// export default DefaultLayout;

// ======================

// src/layouts/DefaultLayout.jsx
// src/layouts/DefaultLayout.jsx
import React, { useRef } from 'react';
import classNames from 'classnames/bind';
import Header from '../../layouts/components/header/header';
import ScrollToTopButton from '~/components/ScrollToTopButton/ScrollToTopButton';
import { ScrollProvider } from '~/contexts/ScrollContext';
import styles from './defaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const sectionRefs = {
        AboutMeRef: useRef(null),
        ExperienceProjectsRef: useRef(null),
        EducationRef: useRef(null),
        ProfessionalSkillRef: useRef(null),
    };

    const scrollToSection = (key) => {
        const ref = sectionRefs[key];
        if (ref?.current) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        } else {
            console.warn(`[Scroll] Không tìm thấy section với key: ${key}`);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Header scrollToSection={scrollToSection} />
            </div>

            <div className={cx('container')}>
                <div className={cx('content')}>
                    <ScrollProvider sectionRefs={sectionRefs} scrollToSection={scrollToSection}>
                        {children}
                        <ScrollToTopButton />
                    </ScrollProvider>
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
