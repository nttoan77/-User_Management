// src/pages/filePrivate/chooseCV/MyProfilePage.js
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MyProfilePage.module.scss';

// Import components
import ChooseCV from '../chooseCV/ChooseCV';
import ProfileTabs from '~/components/profileTabs/ProfileTabs';
import NotesSection from '~/features/notes/components/NotesSection/NotesSection';
import HeaderChooseCV from '../chooseCV/headerChooseCV/hearderChooseCV';

const cx = classNames.bind(styles);

function MyProfilePage() {
    const [activeTab, setActiveTab] = useState('cv');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className={cx('profile-container')}>
            {/* Header cũ của bạn */}
            <div className={cx('header-wrapper')}>
                <HeaderChooseCV />
            </div>

            {/* Tabs */}
            <div className={cx('tabs-section')}>
                <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* Nội dung theo tab */}
            <div className={cx('tab-content')}>
                <div className={cx('content-area')}>
                    {activeTab === 'cv' && <ChooseCV />}
                    {activeTab === 'notes' && <NotesSection />}
                </div>
            </div>
        </div>
    );
}

export default MyProfilePage;
