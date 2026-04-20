import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './editSkillForm.module.scss';

const cx = classNames.bind(style);

function EditSkills({ value = [], onChange }) {
  // State chứa danh sách skills
  const [skills, setSkills] = useState([]);

  // ✅ CHỮA: Đồng bộ dữ liệu từ parent (hỗ trợ create & edit/restore)
  useEffect(() => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        // Nếu backend trả rỗng → tạo item mặc định (cho create mới)
        setSkills([
          {
            name: '',
            description: '',
            category: 'hard',
            level: 'intermediate',
          },
        ]);
      } else {
        // Format lại nếu cần (đảm bảo các field tồn tại)
        const formatted = value.map((skill) => ({
          name: skill.name || '',
          description: skill.description || '',
          category: skill.category || 'hard',
          level: skill.level || 'intermediate',
        }));
        setSkills(formatted);
      }
    }
  }, [value]);

  // Hàm update chung và gửi lên parent
  const updateSkills = (newSkills) => {
    setSkills(newSkills);
    onChange && onChange(newSkills);
  };

  // Cập nhật field của skill item
  const handleChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index] = {
      ...newSkills[index],
      [field]: value,
    };
    updateSkills(newSkills);
  };

  // Thêm skill mới
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

  // Xóa skill
  const handleRemove = (index) => {
    if (skills.length === 1) {
      alert('Phải có ít nhất một kỹ năng!');
      return;
    }
    const newSkills = skills.filter((_, i) => i !== index);
    updateSkills(newSkills);
  };

  return (
    <div className={cx('form-container')}>
      <h3>Kỹ năng</h3>

      {skills.map((skill, index) => (
        <div key={index} className={cx('form-item')}>
          {/* ✅ CHỮA: dùng key=index ổn định (nếu có _id từ backend thì dùng _id làm key) */}

          {/* Tên kỹ năng - required */}
          <div className={cx('form-group')}>
            <label>Tên kỹ năng *</label>
            <input
              type="text"
              value={skill.name}
              placeholder="VD: React, Node.js, Giao tiếp..."
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              required
            />
          </div>

          {/* Mô tả kỹ năng - dùng textarea */}
          <div className={cx('form-group')}>
            <label>Mô tả kỹ năng</label>
            <textarea
              rows={3}
              value={skill.description}
              placeholder="VD: Xây dựng SPA, làm việc với REST API, teamwork..."
              onChange={(e) => handleChange(index, 'description', e.target.value)}
            />
          </div>

          {/* Loại kỹ năng */}
          <div className={cx('form-group')}>
            <label>Loại kỹ năng</label>
            <select
              value={skill.category}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
            >
              <option value="hard">Kỹ năng cứng</option>
              <option value="soft">Kỹ năng mềm</option>
            </select>
          </div>

          {/* Trình độ - bỏ comment */}
          <div className={cx('form-group')}>
            <label>Trình độ</label>
            <select
              value={skill.level}
              onChange={(e) => handleChange(index, 'level', e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* ✅ CHỮA: Chỉ cho xóa nếu có nhiều hơn 1 item */}
          {skills.length > 1 && (
            <button
              type="button"
              className={cx('btn-remove')}
              onClick={() => handleRemove(index)}
            >
              ✕ Xóa kỹ năng
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={handleAdd} className={cx('btn-add')}>
        + Thêm kỹ năng
      </button>
    </div>
  );
}

export default EditSkills;