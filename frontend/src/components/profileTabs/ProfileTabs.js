// src/components/ProfileTabs.js
import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProfileTabs.module.scss';

const cx = classNames.bind(styles);

function ProfileTabs({ activeTab, onTabChange }) {
    return (
        <div className={cx('tabs-wrapper')}>
            <div className={cx('tabs')}>
                <button
                    className={cx('tab', { active: activeTab === 'cv' })}
                    onClick={() => onTabChange('cv')}
                >
                    Hồ sơ CV
                </button>
                <button
                    className={cx('tab', { active: activeTab === 'notes' })}
                    onClick={() => onTabChange('notes')}
                >
                    Ghi chú
                </button>
                <button
                    className={cx('tab', { active: activeTab === 'jobTracker' })}
                    onClick={() => onTabChange('jobTracker')}
                >
                    lịch trình cv
                </button>
            </div>
        </div>
    );
}

export default ProfileTabs;