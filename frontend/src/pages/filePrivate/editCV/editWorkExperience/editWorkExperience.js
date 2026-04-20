import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './editWorkExperience.module.scss';

const cx = classNames.bind(style);

function EditWorkExperience({ value = [], onChange }) {
    // ✅ CHỮA: dùng tên state nhất quán với backend
    const [workExperiences, setWorkExperiences] = useState([]);

    // ✅ CHỮA: Đồng bộ dữ liệu từ parent (hỗ trợ create & edit/restore)
    useEffect(() => {
        if (Array.isArray(value)) {
            if (value.length === 0) {
                // Nếu backend trả rỗng → tạo item mặc định (cho tạo mới)
                setWorkExperiences([
                    {
                        company: '',
                        position: '',
                        startDate: '',
                        endDate: '',
                        description: '',
                        achievements: '',
                    },
                ]);
            } else {
                // Format date từ backend (ISO → YYYY-MM-DD cho input date)
                const formatted = value.map((exp) => ({
                    ...exp,
                    startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                    endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
                    company: exp.company || '',
                    position: exp.position || '',
                    description: exp.description || '',
                    achievements: exp.achievements || '',
                }));
                setWorkExperiences(formatted);
            }
        }
    }, [value]);

    // Hàm update chung và gửi lên parent
    const updateExperiences = (newExperiences) => {
        setWorkExperiences(newExperiences);
        onChange && onChange(newExperiences);
    };

    // Cập nhật field của experience item
    const handleChange = (index, e) => {
        const { name, value: inputValue } = e.target;
        const newExperiences = [...workExperiences];
        newExperiences[index][name] = inputValue;
        updateExperiences(newExperiences);
    };

    // Thêm experience mới
    const handleAdd = () => {
        updateExperiences([
            ...workExperiences,
            {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: '',
                achievements: '',
            },
        ]);
    };

    // Xóa experience
    const handleRemove = (index) => {
        if (workExperiences.length === 1) {
            alert('Phải có ít nhất một kinh nghiệm làm việc!');
            return;
        }
        const newExperiences = workExperiences.filter((_, i) => i !== index);
        updateExperiences(newExperiences);
    };

    return (
        <div className={cx('form-container')}>
            <div className={cx('header-content')}>Kinh nghiệm làm việc</div>

            {workExperiences.map((exp, index) => (
                <div key={index} className={cx('form-item')}>
                    {/* ✅ CHỮA: dùng key=index ổn định (nếu có _id từ backend thì dùng _id làm key) */}
                    <div className={cx('map')}>
                        <div className={cx('map-idx')}>Kinh nghiệm thứ: {index + 1}</div>
                        {workExperiences.length > 1 && (
                            <div className={cx('handle-remove')}>
                                <button type="button" className={cx('btn-remove')} onClick={() => handleRemove(index)}>
                                    X
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={cx('form-group')}>
                        <label>Tên công ty *</label>
                        <input
                            type="text"
                            name="company"
                            value={exp.company}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Nhập tên công ty..."
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Chức danh *</label>
                        <input
                            type="text"
                            name="position"
                            value={exp.position}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="VD: Nhân viên kinh doanh"
                            required
                        />
                    </div>

                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label>Từ ngày *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={exp.startDate || ''}
                                onChange={(e) => handleChange(index, e)}
                                required
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label>Đến ngày</label>
                            <input
                                type="date"
                                name="endDate"
                                value={exp.endDate || ''}
                                onChange={(e) => handleChange(index, e)}
                            />
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label>Mô tả công việc</label>
                        <textarea
                            name="description"
                            value={exp.description || ''}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Mô tả công việc, nhiệm vụ chính..."
                            rows={4}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Thành tích nổi bật</label>
                        <textarea
                            name="achievements"
                            value={exp.achievements || ''}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="VD: Hoàn thành 120% KPI, dẫn dắt dự án XYZ..."
                            rows={4}
                        />
                    </div>
                </div>
            ))}

            <button type="button" onClick={handleAdd} className={cx('btn-add')}>
                + Thêm kinh nghiệm
            </button>
        </div>
    );
}

export default EditWorkExperience;
