// src/pages/RegisInformationUser/RegisInformationUser.jsx
import { useState, useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useNavigate, Navigate } from 'react-router-dom';
import httpRequest from '~/utils/httpRequest';
import { AuthContext } from '~/context/AuthContext';
import style from './regisInformationUser.module.scss';

const cx = classNames.bind(style);

const labels = {
  fullName: 'Họ và tên (chính chủ): ',
  birthDay: 'Ngày tháng năm sinh:',
  gender: 'Giới tính: ',
  currentAddress: 'Địa chỉ nơi ở: ',
};

function RegisInformationUser() {
  const navigate = useNavigate();
  const { user, loginUser } = useContext(AuthContext);

  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(null);           // file object
  const [previewUrl, setPreviewUrl] = useState('');     // để hiện ảnh preview
  const [birthDay, setBirthDay] = useState('');
  const [gender, setGender] = useState('');             // "nam", "nữ", "khác"
  const [currentAddress, setCurrentAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Nếu đã hoàn thiện hồ sơ → tự động chuyển hướng (không cho vào trang này nữa)
  useEffect(() => {
    if (user?.isProfileComplete) {
      navigate('/choose-cv', { replace: true });
    }
  }, [user, navigate]);

  // Xử lý chọn ảnh + tạo preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file)); // tạo URL tạm để preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate frontend
    if (!fullName.trim() || !birthDay || !gender || !currentAddress.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc!');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('birthDay', birthDay);
      formData.append('currentAddress', currentAddress.trim());

      // Chuyển giới tính tiếng Việt → tiếng Anh (khớp với schema)
      const genderMap = { nam: 'male', nữ: 'female', khác: 'other' };
      formData.append('gender', genderMap[gender.toLowerCase()] || 'other');

      // Chỉ append ảnh nếu người dùng chọn
      if (avatar) {
        formData.append('avatar', avatar);
      }

      // GỌI API – QUAN TRỌNG: KHÔNG SET Content-Type ĐỂ AXIOS TỰ THÊM BOUNDARY
      const res = await httpRequest.post('/api/auth/complete-profile', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          // ĐỪNG ĐỘNG VÀO Content-Type → axios sẽ tự set đúng multipart/form-data + boundary
        },
      });

      // Cập nhật user trong context + localStorage
      const updatedUser = {
        ...user,
        ...res.data.user,
        isProfileComplete: true,
      };

      loginUser(updatedUser, localStorage.getItem('token'));
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess(true);

      // Chuyển hướng sau 1.5s để người dùng thấy thông báo thành công
      setTimeout(() => {
        navigate('/choose-cv', { replace: true });
      }, 1500);

    } catch (err) {
      console.error('Lỗi hoàn thiện hồ sơ:', err);
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Dự phòng: nếu user đã hoàn thiện mà vẫn vào được trang này
  if (user?.isProfileComplete) {
    return <Navigate to="/choose-cv" replace />;
  }

  return (
    <form className={cx('container')} onSubmit={handleSubmit}>
      <div className={cx('wrapper')}>
        <div className={cx('personal-information')}>
          <h3 className={cx('h3-content')}>Hoàn thiện hồ sơ cá nhân</h3>

          {/* Thông báo thành công */}
          {success && (
            <div className={cx('alert', 'alert-success')}>
              Hoàn thiện hồ sơ thành công! Đang chuyển hướng...
            </div>
          )}

          {/* Thông báo lỗi */}
          {error && <div className={cx('alert', 'alert-error')}>{error}</div>}

          {/* Họ và tên */}
          <div className={cx('m-item')}>
            <div className={cx('m-item-content')}>{labels.fullName}</div>
            <input
              className={cx('m-item-input')}
              placeholder="VD: Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Ảnh đại diện */}
          <div className={cx('form-item', 'form-avatar')}>
            <div className={cx('form-label')}>Ảnh đại diện (không bắt buộc)</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className={cx('form-input', 'form-input-file')}
            />
            {previewUrl && (
              <div className={cx('preview')}>
                <img src={previewUrl} alt="Preview avatar" className={cx('preview-img')} />
                <p className={cx('preview-name')}>{avatar.name}</p>
              </div>
            )}
          </div>

          {/* Ngày sinh */}
          <div className={cx('m-item')}>
            <div className={cx('m-item-content')}>{labels.birthDay}</div>
            <input
              type="date"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Giới tính */}
          <div className={cx('m-item', 'm-item-checkbox')}>
            <div className={cx('m-item-content')}>{labels.gender}</div>
            <div className={cx('gender-options')}>
              {['nam', 'nữ', 'khác'].map((g) => (
                <label key={g} className={cx('gender-label')}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={loading}
                  />
                  <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Địa chỉ */}
          <div className={cx('m-item')}>
            <div className={cx('m-item-content')}>{labels.currentAddress}</div>
            <input
              className={cx('m-item-input')}
              placeholder="VD: Quận 7, TP.HCM"
              value={currentAddress}
              onChange={(e) => setCurrentAddress(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Nút submit */}
        <div className={cx('footer')}>
          <button
            type="submit"
            className={cx('btn', { loading })}
            disabled={loading || success}
          >
            {loading ? 'Đang xử lý...' : success ? 'Hoàn thành!' : 'Hoàn thiện hồ sơ'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default RegisInformationUser;