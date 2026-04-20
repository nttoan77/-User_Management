import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './editEducation.module.scss';

const cx = classNames.bind(style);

function EditEducation({ value = [], onChange }) {
    const [educations, setEducations] = useState([]);

    // ✅ CHỮA: Load dữ liệu + loại bỏ dấu ngoặc kép thừa nếu backend trả về "toán"
    useEffect(() => {
        if (Array.isArray(value)) {
            if (value.length === 0) {
                setEducations([
                    {
                        school: '',
                        degree: '',
                        fieldOfStudy: '',
                        startDate: '',
                        endDate: '',
                        description: '',
                        subjects: '',
                        achievements: '',
                    },
                ]);
            } else {
                const formatted = value.map((edu) => ({
                    ...edu,
                    startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
                    endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
                    // ✅ CHỮA: loại bỏ dấu ngoặc kép thừa nếu có (ví dụ: "\"toán\"" → "toán")
                    subjects: (Array.isArray(edu.subjects) ? edu.subjects.join(', ') : edu.subjects || '')
                        .replace(/^"|"$/g, '') // loại dấu " đầu và cuối
                        .replace(/\\"/g, '"') // thay \" thành "
                        .trim(),
                    achievements: (Array.isArray(edu.achievements)
                        ? edu.achievements.join(', ')
                        : edu.achievements || ''
                    )
                        .replace(/^"|"$/g, '')
                        .replace(/\\"/g, '"')
                        .trim(),
                }));
                setEducations(formatted);
            }
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

        // ✅ CHỮA: khi người dùng nhập, loại bỏ dấu ngoặc kép thừa nếu họ vô tình nhập
        const cleanedValue = inputValue
            .replace(/^"|"$/g, '') // loại dấu " đầu cuối
            .replace(/\\"/g, '"') // thay \" thành "
            .trim();

        newEducations[index][name] = cleanedValue;
        updateEducations(newEducations);
    };

    // Thêm education mới
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
                subjects: '',
                achievements: '',
            },
        ]);
    };

    // Xóa education
    const handleRemoveEducation = (index) => {
        if (educations.length === 1) {
            alert('Phải có ít nhất một mục học vấn!');
            return;
        }
        const newEducations = educations.filter((_, i) => i !== index);
        updateEducations(newEducations);
    };

    return (
        <div className={cx('form-container')}>
            <h3>Trình độ học vấn</h3>

            {educations.map((edu, index) => (
                <div key={index} className={cx('form-item')}>
                    <div className={cx('form-display')}>
                        <div className={cx('form-group', 'input-date')}>
                            <label>Từ ngày *</label>
                            <input
                                className={cx('input-date-i')}
                                type="date"
                                name="startDate"
                                value={edu.startDate || ''}
                                onChange={(e) => handleChange(index, e)}
                                required
                            />
                        </div>
                        <div className={cx('form-group', 'input-date')}>
                            <label>Đến ngày</label>
                            <input
                                className={cx('input-date-i')}
                                type="date"
                                name="endDate"
                                value={edu.endDate || ''}
                                onChange={(e) => handleChange(index, e)}
                            />
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label>Trường học *</label>
                        <input
                            type="text"
                            name="school"
                            value={edu.school || ''}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Ví dụ: Đại học Ngoại thương"
                            required
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Bằng cấp</label>
                        <input
                            type="text"
                            name="degree"
                            value={edu.degree || ''}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Ví dụ: Cử nhân"
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Chuyên ngành</label>
                        <input
                            type="text"
                            name="fieldOfStudy"
                            value={edu.fieldOfStudy || ''}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Ví dụ: Quản trị kinh doanh"
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Mô tả thêm</label>
                        <textarea
                            name="description"
                            value={edu.description || ''}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Ví dụ: GPA 3.7/4.0, các hoạt động liên quan..."
                            rows={3}
                        />
                    </div>

                    {/* Môn học liên quan - lưu string */}
                    <div className={cx('form-group')}>
                        <label>Môn học nổi bật (cách nhau bằng dấu phẩy)</label>
                        <textarea
                            name="subjects"
                            value={edu.subjects || ''}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="VD: Toán, Lý, Hóa, Tin học"
                            rows={2}
                        />
                    </div>

                    {/* Thành tích nổi bật - lưu string */}
                    <div className={cx('form-group')}>
                        <label>Thành tích nổi bật (cách nhau bằng dấu phẩy)</label>
                        <textarea
                            name="achievements"
                            value={edu.achievements || ''}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="VD: Giải nhất học sinh giỏi Toán tỉnh, GPA 3.8/4.0"
                            rows={2}
                        />
                    </div>

                    {educations.length > 1 && (
                        <button type="button" className={cx('btn-remove')} onClick={() => handleRemoveEducation(index)}>
                            Xóa mục học vấn này
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

export default EditEducation;
