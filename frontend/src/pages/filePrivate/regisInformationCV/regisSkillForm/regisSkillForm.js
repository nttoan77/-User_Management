import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './regisSkillForm.module.scss';

const cx = classNames.bind(style);

function AddSkills({ value = [], onChange }) {
    const [skills, setSkills] = useState(
        value.length > 0
            ? value
            : [
                  {
                      name: '',
                      description: '',
                      category: 'hard',
                      level: 'intermediate',
                  },
              ]
    );

    // 🔄 Đồng bộ từ component cha
    useEffect(() => {
        if (value && value.length > 0) {
            setSkills(value);
        }
    }, [value]);

    const updateSkills = (newSkills) => {
        setSkills(newSkills);
        onChange && onChange(newSkills);
    };

    const handleChange = (index, field, value) => {
        const newSkills = [...skills];
        newSkills[index] = {
            ...newSkills[index],
            [field]: value,
        };
        updateSkills(newSkills);
    };

    const handleAdd = () => {
        updateSkills([
            ...skills,
            {
                name: '',
                description: '',
                category: 'hard',
                level: 'intermediate',
            },
        ]);
    };

    const handleRemove = (index) => {
        updateSkills(skills.filter((_, i) => i !== index));
    };

    return (
        <div className={cx('form-container')}>
            <h3>Kỹ năng</h3>

            {skills.map((skill, index) => (
                <div key={index} className={cx('form-item')}>
                    {/* Tên kỹ năng */}
                    <div className={cx('form-group')}>
                        <label>Tên kỹ năng</label>
                        <input
                            type="text"
                            value={skill.name}
                            placeholder="VD: React, Node.js, Giao tiếp..."
                            onChange={(e) =>
                                handleChange(index, 'name', e.target.value)
                            }
                        />
                    </div>

                    {/* Mô tả kỹ năng */}
                    <div className={cx('form-group')}>
                        <label>Mô tả kỹ năng</label>
                        <input
                            rows={3}
                            value={skill.description}
                            placeholder="VD: Xây dựng SPA, làm việc với REST API, teamwork..."
                            onChange={(e) =>
                                handleChange(
                                    index,
                                    'description',
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    {/* Loại kỹ năng */}
                    <div className={cx('form-group')}>
                        <label>Loại kỹ năng</label>
                        <select
                            value={skill.category}
                            onChange={(e) =>
                                handleChange(
                                    index,
                                    'category',
                                    e.target.value
                                )
                            }
                        >
                            <option value="hard">Kỹ năng cứng</option>
                            <option value="soft">Kỹ năng mềm</option>
                        </select>
                    </div>

                    {/* Trình độ */}
                    {/* <div className={cx('form-group')}>
                        <label>Trình độ</label>
                        <select
                            value={skill.level}
                            onChange={(e) =>
                                handleChange(index, 'level', e.target.value)
                            }
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div> */}

                    {/* Xóa kỹ năng */}
                    <button
                        type="button"
                        className={cx('btn-remove')}
                        onClick={() => handleRemove(index)}
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button type="button" onClick={handleAdd} className={cx('btn-add')}>
                + Thêm kỹ năng
            </button>
        </div>
    );
}

export default AddSkills;
