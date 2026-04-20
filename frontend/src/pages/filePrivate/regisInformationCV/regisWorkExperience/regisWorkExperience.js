import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './regisWorkExperience.module.scss';

const cx = classNames.bind(style);

function WorkExperience({ value = [], onChange }) {
    const [educations, setEducations] = useState(
        value.length > 0
            ? value
            : [
                  {
                      company: '',
                      position: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                      achievements: '',
                  },
              ],
    );

    useEffect(() => {
        setEducations(
            value.length > 0
                ? value
                : [{ company: '', position: '', startDate: '', endDate: '', description: '', achievements: '' }],
        );
    }, [value]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newEducations = [...educations];
        newEducations[index][name] = value;
        setEducations(newEducations);
        onChange(newEducations);
    };

    const handleAdd = () => {
        const newEducations = [
            ...educations,
            {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: '',
                achievements: '',
            },
        ];
        setEducations(newEducations);
        onChange(newEducations);
    };

    const handleRemove = (index) => {
        const newEducations = educations.filter((_, i) => i !== index);
        setEducations(newEducations);
        onChange(newEducations);
    };

    return (
        <div className={cx('form-container')}>
            <div className={cx('header-content')}>Kinh nghiệm làm việc</div>
            {educations.map((edu, index) => (
                <div key={index} className={cx('form-item')}>
                    <div className={cx('map')}>
                        <div className={cx('map-idx')}> Hồ sơ thứ: {index + 1}</div>
                        {educations.length > 1 && (
                            <div className={cx('handle-remove')}>
                                <button type="button" className={cx('btn-remove')} onClick={() => handleRemove(index)}>
                                    X
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={cx('form-group')}>
                        <label>Tên công ty</label>
                        <input
                            type="text"
                            name="company"
                            value={edu.company}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Nhập tên công ty..."
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label>Chức danh</label>
                        <input
                            type="text"
                            name="position"
                            value={edu.position}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="VD: Nhân viên kinh doanh"
                        />
                    </div>
                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label>Từ ngày</label>
                            <input
                                type="date" // ✅ SỬA
                                name="startDate"
                                value={edu.startDate || ''} // ✅ SỬA
                                onChange={(e) => handleChange(index, e)}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label>Đến ngày</label>
                            <input
                                type="date" // ✅ SỬA
                                name="endDate"
                                value={edu.endDate || ''} // ✅ SỬA
                                onChange={(e) => handleChange(index, e)}
                            />
                        </div>
                    </div>
                    <div className={cx('form-group')}>
                        <label>Mô tả công việc</label>
                        <textarea
                            name="description"
                            value={edu.description}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Mô tả công việc, nhiệm vụ chính..."
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label>Thành tích nổi bật</label>
                        <textarea
                            name="achievements"
                            value={edu.achievements}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="VD: Hoàn thành 120% KPI..."
                        />
                    </div>
                </div>
            ))}

            <button type="button" onClick={handleAdd} className={cx('btn-add')}>
                + Thêm
            </button>
        </div>
    );
}

export default WorkExperience;
