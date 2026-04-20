// import React, { useState, useEffect } from 'react';

// import classNames from 'classnames/bind';
// import styles from './AdminMainSettings.module.scss';
// import axios from 'axios';

// const cx = classNames.bind(styles);

// const SETTINGS_API = `${process.env.REACT_APP_API_URL || 'http://localhost:8888'}/api/admin/settings`;

// const TABS = [
//   { id: 'general', label: 'Cài đặt hệ thống' },
//   { id: 'security', label: 'Cài đặt bảo mật' },
//   { id: 'email', label: 'Quản lý email hệ thống' },
//   { id: 'upload', label: 'Cài đặt upload file' },
//   { id: 'notification', label: 'Cài đặt thông báo' },
//   { id: 'log', label: 'Quản lý log hệ thống' },
//   { id: 'features', label: 'Feature Flags' }, // phần bổ sung hữu ích
// ];

// const AdminMainSettings = () => {
//   const [activeTab, setActiveTab] = useState('general');
//   const [settings, setSettings] = useState({
//     // Cài đặt hệ thống
//     siteName: 'Quản Lý CV Ấm',
//     siteDescription: '',
//     primaryColor: '#4f46e5',
//     logoUrl: '',

//     // Bảo mật
//     require2FA: false,
//     maxLoginAttempts: 5,
//     lockoutMinutes: 15,
//     passwordMinLength: 8,

//     // Email hệ thống
//     smtpHost: 'smtp.gmail.com',
//     smtpPort: 587,
//     smtpUser: '',
//     smtpPass: '', // sẽ hiển thị dạng ••••••
//     fromEmail: 'no-reply@amcv.vn',
//     fromName: 'Hệ thống CV Ấm',

//     // Upload file
//     maxFileSizeMB: 10,
//     allowedExtensions: '.pdf,.docx,.doc',
//     maxCVPerUser: 5,

//     // Thông báo
//     enableEmailNotification: true,
//     enableNewCVAlert: true,
//     adminEmailForAlert: 'admin@amcv.vn',

//     // Log
//     logLevel: 'info',
//     logRetentionDays: 30,
//     autoCleanLog: true,

//     // Feature Flags
//     enableCVBuilder: true,
//     enableJobPosting: false,
//     enableReferralSystem: true,
//   });

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState(null);

//   // Fetch settings (sẽ kết nối backend sau)
//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(SETTINGS_API, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSettings(res.data);
//       } catch (err) {
//         console.log('Chưa có API, dùng dữ liệu mặc định');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSettings((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setMessage(null);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.patch(SETTINGS_API, settings, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage({ type: 'success', text: '✅ Đã lưu cài đặt thành công!' });
//     } catch (err) {
//       setMessage({ type: 'error', text: '❌ Lưu thất bại, vui lòng thử lại' });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className={cx('loading')}>Đang tải cài đặt...</div>;

//   return (
//     <div className={cx('settings-wrapper')}>
//       <h2 className={cx('page-title')}>Cài đặt hệ thống</h2>

//       {message && (
//         <div className={cx('message', message.type)}>
//           {message.text}
//         </div>
//       )}

//       <div className={cx('settings-container')}>
//         {/* Sidebar tabs */}
//         <div className={cx('tab-sidebar')}>
//           {TABS.map((tab) => (
//             <button
//               key={tab.id}
//               className={cx('tab-item', { active: activeTab === tab.id })}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Nội dung từng tab */}
//         <div className={cx('tab-content')}>
//           {/* ================== CÀI ĐẶT HỆ THỐNG ================== */}
//           {activeTab === 'general' && (
//             <section className={cx('section')}>
//               <h3>Cài đặt hệ thống</h3>
//               <div className={cx('form-group')}>
//                 <label>Tên hệ thống</label>
//                 <input type="text" name="siteName" value={settings.siteName} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>Mô tả ngắn</label>
//                 <textarea name="siteDescription" value={settings.siteDescription} onChange={handleInputChange} rows="3" />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>Màu chủ đạo</label>
//                 <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>URL Logo</label>
//                 <input type="text" name="logoUrl" value={settings.logoUrl} onChange={handleInputChange} placeholder="https://..." />
//               </div>
//             </section>
//           )}

//           {/* ================== BẢO MẬT ================== */}
//           {activeTab === 'security' && (
//             <section className={cx('section')}>
//               <h3>Cài đặt bảo mật</h3>
//               <div className={cx('form-group')}>
//                 <label>Số lần đăng nhập sai tối đa</label>
//                 <input type="number" name="maxLoginAttempts" value={settings.maxLoginAttempts} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>Khóa tài khoản trong (phút)</label>
//                 <input type="number" name="lockoutMinutes" value={settings.lockoutMinutes} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>Độ dài mật khẩu tối thiểu</label>
//                 <input type="number" name="passwordMinLength" value={settings.passwordMinLength} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group', 'checkbox')}>
//                 <input type="checkbox" name="require2FA" checked={settings.require2FA} onChange={handleInputChange} />
//                 <label>Bắt buộc 2FA cho admin</label>
//               </div>
//             </section>
//           )}

//           {/* ================== EMAIL HỆ THỐNG ================== */}
//           {activeTab === 'email' && (
//             <section className={cx('section')}>
//               <h3>Quản lý email hệ thống</h3>
//               <div className={cx('form-group')}>
//                 <label>SMTP Host</label>
//                 <input type="text" name="smtpHost" value={settings.smtpHost} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>SMTP Port</label>
//                 <input type="number" name="smtpPort" value={settings.smtpPort} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>Email gửi (From)</label>
//                 <input type="email" name="fromEmail" value={settings.fromEmail} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>Tên người gửi</label>
//                 <input type="text" name="fromName" value={settings.fromName} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>SMTP User</label>
//                 <input type="text" name="smtpUser" value={settings.smtpUser} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>SMTP Password</label>
//                 <input type="password" name="smtpPass" value={settings.smtpPass} onChange={handleInputChange} placeholder="••••••••" />
//               </div>
//             </section>
//           )}

//           {/* ================== UPLOAD FILE ================== */}
//           {activeTab === 'upload' && (
//             <section className={cx('section')}>
//               <h3>Cài đặt upload file (CV)</h3>
//               <div className={cx('form-group')}>
//                 <label>Dung lượng tối đa mỗi file (MB)</label>
//                 <input type="number" name="maxFileSizeMB" value={settings.maxFileSizeMB} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>Định dạng cho phép</label>
//                 <input type="text" name="allowedExtensions" value={settings.allowedExtensions} onChange={handleInputChange} placeholder=".pdf,.docx" />
//               </div>
//               <div className={cx('form-group')}>
//                 <label>Số CV tối đa mỗi người dùng</label>
//                 <input type="number" name="maxCVPerUser" value={settings.maxCVPerUser} onChange={handleInputChange} />
//               </div>
//             </section>
//           )}

//           {/* ================== THÔNG BÁO ================== */}
//           {activeTab === 'notification' && (
//             <section className={cx('section')}>
//               <h3>Cài đặt thông báo</h3>
//               <div className={cx('form-group', 'checkbox')}>
//                 <input type="checkbox" name="enableEmailNotification" checked={settings.enableEmailNotification} onChange={handleInputChange} />
//                 <label>Gửi email thông báo cho người dùng</label>
//               </div>
//               <div className={cx('form-group', 'checkbox')}>
//                 <input type="checkbox" name="enableNewCVAlert" checked={settings.enableNewCVAlert} onChange={handleInputChange} />
//                 <label>Gửi cảnh báo cho admin khi có CV mới</label>
//               </div>
//               <div className={cx('form-group')}>
//                 <label>Email admin nhận cảnh báo</label>
//                 <input type="email" name="adminEmailForAlert" value={settings.adminEmailForAlert} onChange={handleInputChange} />
//               </div>
//             </section>
//           )}

//           {/* ================== QUẢN LÝ LOG ================== */}
//           {activeTab === 'log' && (
//             <section className={cx('section')}>
//               <h3>Quản lý log hệ thống</h3>
//               <div className={cx('form-group')}>
//                 <label>Mức độ log</label>
//                 <select name="logLevel" value={settings.logLevel} onChange={handleInputChange}>
//                   <option value="debug">Debug</option>
//                   <option value="info">Info</option>
//                   <option value="warn">Warning</option>
//                   <option value="error">Error</option>
//                 </select>
//               </div>
//               <div className={cx('form-group')}>
//                 <label>Giữ log trong (ngày)</label>
//                 <input type="number" name="logRetentionDays" value={settings.logRetentionDays} onChange={handleInputChange} />
//               </div>
//               <div className={cx('form-group', 'checkbox')}>
//                 <input type="checkbox" name="autoCleanLog" checked={settings.autoCleanLog} onChange={handleInputChange} />
//                 <label>Tự động dọn log cũ</label>
//               </div>
//             </section>
//           )}

//           {/* ================== FEATURE FLAGS ================== */}
//           {activeTab === 'features' && (
//             <section className={cx('section')}>
//               <h3>Feature Flags</h3>
//               <div className={cx('form-group', 'checkbox')}>
//                 <input type="checkbox" name="enableCVBuilder" checked={settings.enableCVBuilder} onChange={handleInputChange} />
//                 <label>Bật CV Builder</label>
//               </div>
//               <div className={cx('form-group', 'checkbox')}>
//                 <input type="checkbox" name="enableJobPosting" checked={settings.enableJobPosting} onChange={handleInputChange} />
//                 <label>Bật chức năng đăng tin tuyển dụng</label>
//               </div>
//               <div className={cx('form-group', 'checkbox')}>
//                 <input type="checkbox" name="enableReferralSystem" checked={settings.enableReferralSystem} onChange={handleInputChange} />
//                 <label>Bật hệ thống giới thiệu (Referral)</label>
//               </div>
//             </section>
//           )}
//         </div>
//       </div>

//       {/* Nút lưu chung */}
//       <div className={cx('save-bar')}>
//         <button onClick={handleSave} disabled={saving} className={cx('btn-save')}>
//           {saving ? 'Đang lưu...' : '💾 Lưu tất cả cài đặt'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminMainSettings;


// ==============================

import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminMainSettings.module.scss';
import axios from 'axios';

const cx = classNames.bind(styles);
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8888';
    const ADMIN_API = `${API_BASE}/api/admin/users/settings`;


const TABS = [
  { id: 'general', label: 'Cài đặt hệ thống' },
  { id: 'security', label: 'Cài đặt bảo mật' },
  { id: 'email', label: 'Quản lý email hệ thống' },
  { id: 'upload', label: 'Cài đặt upload file' },
  { id: 'notification', label: 'Cài đặt thông báo' },
  { id: 'log', label: 'Quản lý log hệ thống' },
  { id: 'features', label: 'Feature Flags' },
];

const AdminMainSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(null);           // ← Để null ban đầu
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // ==================== FETCH SETTINGS ====================
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(ADMIN_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSettings(res.data);        // Backend trả về object có general, security, email...
    } catch (err) {
      console.error("Lỗi khi lấy settings:", err.response?.data || err.message);
      setMessage({ type: 'error', text: 'Không thể tải cài đặt hệ thống' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ==================== XỬ LÝ THAY ĐỔI INPUT ====================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => {
      if (!prev) return prev;

      // Tìm group chứa field này (general, security, email, ...)
      const group = Object.keys(prev).find(key => 
        typeof prev[key] === 'object' && prev[key] !== null && name in prev[key]
      );

      if (group) {
        return {
          ...prev,
          [group]: {
            ...prev[group],
            [name]: type === 'checkbox' ? checked : value,
          },
        };
      }

      // Nếu không tìm thấy group (trường hợp đặc biệt)
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  // ==================== LƯU SETTINGS ====================
  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');

      await axios.patch(ADMIN_API, settings, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: 'success', text: '✅ Cập nhật cài đặt thành công!' });

      // Tải lại dữ liệu sau khi lưu thành công
      setTimeout(() => {
        fetchSettings();
      }, 800);

    } catch (err) {
      console.error(err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || '❌ Lưu thất bại, vui lòng thử lại' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={cx('loading')}>Đang tải cài đặt hệ thống...</div>;
  }

  if (!settings) {
    return <div className={cx('loading')}>Không thể tải dữ liệu cài đặt</div>;
  }

  return (
    <div className={cx('settings-wrapper')}>
      <h2 className={cx('page-title')}>Cài đặt hệ thống</h2>

      {message && (
        <div className={cx('message', message.type)}>
          {message.text}
        </div>
      )}

      <div className={cx('settings-container')}>
        {/* Sidebar Tabs */}
        <div className={cx('tab-sidebar')}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={cx('tab-item', { active: activeTab === tab.id })}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Nội dung từng tab */}
        <div className={cx('tab-content')}>
          {/* General */}
          {activeTab === 'general' && (
            <section className={cx('section')}>
              <h3>Cài đặt hệ thống</h3>
              <div className={cx('form-group')}>
                <label>Tên hệ thống</label>
                <input type="text" name="siteName" value={settings.general?.siteName || ''} onChange={handleInputChange} />
              </div>
              <div className={cx('form-group')}>
                <label>Mô tả ngắn</label>
                <textarea name="siteDescription" value={settings.general?.siteDescription || ''} onChange={handleInputChange} rows="3" />
              </div>
              <div className={cx('form-group')}>
                <label>Màu chủ đạo</label>
                <input type="color" name="primaryColor" value={settings.general?.primaryColor || '#4f46e5'} onChange={handleInputChange} />
              </div>
              <div className={cx('form-group')}>
                <label>URL Logo</label>
                <input type="text" name="logoUrl" value={settings.general?.logoUrl || ''} onChange={handleInputChange} placeholder="https://..." />
              </div>
            </section>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <section className={cx('section')}>
              <h3>Cài đặt bảo mật</h3>
              <div className={cx('form-group')}>
                <label>Số lần đăng nhập sai tối đa</label>
                <input type="number" name="maxLoginAttempts" value={settings.security?.maxLoginAttempts || 5} onChange={handleInputChange} />
              </div>
              <div className={cx('form-group')}>
                <label>Khóa tài khoản trong (phút)</label>
                <input type="number" name="lockoutMinutes" value={settings.security?.lockoutMinutes || 15} onChange={handleInputChange} />
              </div>
              <div className={cx('form-group')}>
                <label>Độ dài mật khẩu tối thiểu</label>
                <input type="number" name="passwordMinLength" value={settings.security?.passwordMinLength || 8} onChange={handleInputChange} />
              </div>
              <div className={cx('form-group', 'checkbox')}>
                <input type="checkbox" name="require2FA" checked={settings.security?.require2FA || false} onChange={handleInputChange} />
                <label>Bắt buộc 2FA cho admin</label>
              </div>
            </section>
          )}

          {/* Email - Upload - Notification - Log - Features */}
          {/* Bạn có thể tiếp tục làm tương tự cho các tab còn lại */}

          {/* Ví dụ tab Email */}
          {activeTab === 'email' && (
            <section className={cx('section')}>
              <h3>Quản lý email hệ thống</h3>
              <div className={cx('form-group')}>
                <label>SMTP Host</label>
                <input type="text" name="smtpHost" value={settings.email?.smtpHost || ''} onChange={handleInputChange} />
              </div>
              <div className={cx('form-group')}>
                <label>SMTP Port</label>
                <input type="number" name="smtpPort" value={settings.email?.smtpPort || 587} onChange={handleInputChange} />
              </div>
              <div className={cx('form-group')}>
                <label>Email gửi (From)</label>
                <input type="email" name="fromEmail" value={settings.email?.fromEmail || ''} onChange={handleInputChange} />
              </div>
              <div className={cx('form-group')}>
                <label>Tên người gửi</label>
                <input type="text" name="fromName" value={settings.email?.fromName || ''} onChange={handleInputChange} />
              </div>
              <div className={cx('form-group')}>
                <label>SMTP User</label>
                <input type="text" name="smtpUser" value={settings.email?.smtpUser || ''} onChange={handleInputChange} />
              </div>
              <div className={cx('form-group')}>
                <label>SMTP Password</label>
                <input 
                  type="password" 
                  name="smtpPass" 
                  value={settings.email?.smtpPass || ''} 
                  onChange={handleInputChange} 
                  placeholder="••••••••" 
                />
              </div>
            </section>
          )}

          {/* Các tab còn lại (upload, notification, log, features) bạn làm tương tự như trên */}

        </div>
      </div>

      {/* Nút lưu */}
      <div className={cx('save-bar')}>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className={cx('btn-save')}
        >
          {saving ? 'Đang lưu...' : '💾 Lưu tất cả cài đặt'}
        </button>
      </div>
    </div>
  );
};

export default AdminMainSettings;