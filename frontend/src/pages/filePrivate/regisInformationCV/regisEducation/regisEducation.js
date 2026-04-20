import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './regisEducation.module.scss';

const cx = classNames.bind(style);

function AddEducation({ value = [], onChange }) {
    const [educations, setEducations] = useState(
        value.length > 0
            ? value
            : [
                  {
                      school: '',
                      degree: '',
                      fieldOfStudy: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                      subjects: [],
                      achievements: [],
                  },
              ],
    );

    // Đồng bộ khi prop value thay đổi từ cha
    useEffect(() => {
        if (value && value.length > 0) {
            setEducations(value);
        }
    }, [value]);

    // Hàm update chung
    const updateEducations = (newEducations) => {
        setEducations(newEducations);
        onChange && onChange(newEducations);
    };

    // Cập nhật field chính
    const handleChange = (index, e) => {
        const { name, value: inputValue } = e.target;
        const newEducations = [...educations];
        newEducations[index][name] = inputValue;
        setEducations(newEducations);
        onChange && onChange(newEducations);
    };

    // Thêm học vấn mới
    const handleAddEducation = () => {
        updateEducations([
            ...educations,
            {
                school: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                description: '',
                subjects: [],
                achievements: [],
            },
        ]);
    };

    // Xóa học vấn
    const handleRemoveEducation = (index) => {
        const newEducations = educations.filter((_, i) => i !== index);
        updateEducations(newEducations);
    };

    // Thêm môn học
    const handleAddSubject = (index) => {
        const newEducations = [...educations];
        newEducations[index].subjects.push('');
        updateEducations(newEducations);
    };

    const handleChangeSubject = (eduIndex, subIndex, value) => {
        const newEducations = [...educations];
        newEducations[eduIndex].subjects[subIndex] = value;
        updateEducations(newEducations);
    };

    const handleRemoveSubject = (eduIndex, subIndex) => {
        const newEducations = [...educations];
        newEducations[eduIndex].subjects = newEducations[eduIndex].subjects.filter((_, i) => i !== subIndex);
        updateEducations(newEducations);
    };

    // Thêm thành tích
    const handleAddAchievement = (index) => {
        const newEducations = [...educations];
        newEducations[index].achievements.push('');
        updateEducations(newEducations);
    };

    const handleChangeAchievement = (eduIndex, achIndex, value) => {
        const newEducations = [...educations];
        newEducations[eduIndex].achievements[achIndex] = value;
        updateEducations(newEducations);
    };

    const handleRemoveAchievement = (eduIndex, achIndex) => {
        const newEducations = [...educations];
        newEducations[eduIndex].achievements = newEducations[eduIndex].achievements.filter((_, i) => i !== achIndex);
        updateEducations(newEducations);
    };

    return (
        <div className={cx('form-container')}>
            <h3>Học vấn</h3>
            {educations.map((edu, index) => (
                <div key={index} className={cx('form-item')}>
                    <div className={cx('form-display')}>
                        <div className={cx('form-group', 'input-date')}>
                            <label>Từ ngày</label>
                            <input
                                className={cx('input-date-i')}
                                type="date" // ✅
                                name="startDate"
                                value={edu.startDate || ''} // ✅
                                onChange={(e) => handleChange(index, e)}
                            />
                        </div>
                        <div className={cx('form-group', 'input-date')}>
                            <label>Đến ngày</label>
                            <input
                                className={cx('input-date-i')}
                                type="date" // ✅
                                name="endDate"
                                value={edu.endDate || ''} // ✅
                                onChange={(e) => handleChange(index, e)}
                            />
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label>Trường học</label>
                        <input
                            type="text"
                            name="school"
                            value={edu.school}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Ví dụ: Đại học Ngoại thương"
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Bằng cấp</label>
                        <input
                            type="text"
                            name="degree"
                            value={edu.degree}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Ví dụ: Cử nhân"
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Chuyên ngành</label>
                        <input
                            type="text"
                            name="fieldOfStudy"
                            value={edu.fieldOfStudy}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Ví dụ: Quản trị kinh doanh"
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Mô tả thêm</label>
                        <textarea
                            name="description"
                            value={edu.description}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Ví dụ: GPA 3.7/4.0, các hoạt động liên quan..."
                        />
                    </div>

                    {/* Môn học liên quan */}
                    <div className={cx('partials')}>
                        <label>Môn học liên quan</label>
                        {edu.subjects.map((sub, i) => (
                            <div key={i} className={cx('form-group-inline')}>
                                <input
                                    className={cx('input-partials')}
                                    type="text"
                                    value={sub}
                                    onChange={(e) => handleChangeSubject(index, i, e.target.value)}
                                    placeholder="Nhập môn học..."
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSubject(index, i)}
                                    className={cx('btn-remove')}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddSubject(index)} className={cx('btn-add')}>
                            + Thêm môn học
                        </button>
                    </div>

                    {/* Thành tích nổi bật */}
                    <div className={cx('partials')}>
                        <label>Thành tích nổi bật</label>
                        {edu.achievements.map((ach, i) => (
                            <div key={i} className={cx('form-group-inline')}>
                                <input
                                    className={cx('input-partials')}
                                    type="text"
                                    value={ach}
                                    onChange={(e) => handleChangeAchievement(index, i, e.target.value)}
                                    placeholder="Nhập thành tích..."
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAchievement(index, i)}
                                    className={cx('btn-remove-children')}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddAchievement(index)} className={cx('btn-add')}>
                            + Thêm thành tích
                        </button>
                    </div>

                    {educations.length > 1 && (
                        <button type="button" className={cx('btn-remove')} onClick={() => handleRemoveEducation(index)}>
                            Xóa học vấn
                        </button>
                    )}
                </div>
            ))}

            <button type="button" onClick={handleAddEducation} className={cx('btn-add')}>
                + Thêm học vấn
            </button>
        </div>
    );
}

export default AddEducation;
