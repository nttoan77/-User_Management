// import React, { useRef, useState, useEffect } from 'react';
// import classNames from 'classnames/bind';
// import styles from './UserModal.module.scss';
// import useClickOutside from '~/hooks/useClickOutside';

// const cx = classNames.bind(styles);

// function UserModal({ onClose, user, onSuccess }) {
//     const modalRef = useRef(null);
//     const [visible, setVisible] = useState(false);
//     const [toast, setToast] = useState(null);

//     const [formData, setFormData] = useState({
//         name: user?.nameUser || '',
//         email: user?.email || '',
//         phone: user?.phone || '',
//         workPosition: user?.workPosition || '',
//     });

//     const API_URL = `${process.env.REACT_APP_BASE_URL}/api/auth/Admin`;

//     useEffect(() => {
//         const timer = setTimeout(() => setVisible(true), 10);
//         return () => clearTimeout(timer);
//     }, []);

//     useClickOutside([modalRef], () => handleClose());

//     const handleClose = () => {
//         setVisible(false);
//         setTimeout(() => {
//             onClose && onClose();
//         }, 200);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const showToast = (message, type = 'success') => {
//         setToast({ message, type });
//         setTimeout(() => setToast(null), 3000);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const url = user ? `${API_URL}/${user._id}` : API_URL;
//             const method = user ? 'PUT' : 'POST';

//             const res = await fetch(url, {
//                 method,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });

//             const data = await res.json();

//             if (res.ok) {
//                 showToast(
//                     user
//                         ? 'Cập nhật người dùng thành công!'
//                         : 'Thêm người dùng thành công! (Mật khẩu mặc định: 123456)',
//                     'success'
//                 );

//                 // ✅ Chờ 1 giây để toast hiển thị rồi reload danh sách + đóng modal
//                 setTimeout(() => {
//                     onSuccess && onSuccess(); // gọi fetchUsers() ở Admin
//                     handleClose();
//                 }, 1000);
//             } else {
//                 showToast(data.message || 'Không thể lưu dữ liệu!', 'error');
//             }
//         } catch (error) {
//             console.error(error);
//             showToast('Lỗi khi gửi yêu cầu!', 'error');
//         }
//     };

//     return (
//         <>
//             <div className={cx('overlay', { 'overlay-show': visible })}>
//                 <div ref={modalRef} className={cx('modal', { 'modal-show': visible })}>
//                     <h2>{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</h2>

//                     <form className={cx('form')} onSubmit={handleSubmit}>
//                         <input
//                             className={cx('form-input')}
//                             type="text"
//                             name="nameUser"
//                             value={formData.nameUser}
//                             onChange={handleChange}
//                             placeholder="Tên người dùng"
//                             required
//                         />
//                         <input
//                             className={cx('form-input')}
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             placeholder="Email"
//                             required
//                         />
//                         <input
//                             className={cx('form-input')}
//                             type="tel"
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleChange}
//                             placeholder="Số điện thoại"
//                         />
//                         <input
//                             className={cx('form-input')}
//                             type="text"
//                             name="workPosition"
//                             value={formData.workPosition}
//                             onChange={handleChange}
//                             placeholder="Vị trí làm việc"
//                         />

//                         <div className={cx('actions')}>
//                             <button type="button" onClick={handleClose} className={cx('cancel')}>
//                                 Hủy
//                             </button>
//                             <button type="submit" className={cx('save')}>
//                                 Lưu
//                             </button>
//                         </div>
//                     </form>

//                     <button className={cx('close-btn')} onClick={handleClose}>
//                         ✕
//                     </button>
//                 </div>
//             </div>

//             {toast && <div className={cx('toast', toast.type)}>{toast.message}</div>}
//         </>
//     );
// }

// export default UserModal;

// =====================================

// import React, { useRef, useState, useEffect } from 'react';
// import classNames from 'classnames/bind';
// import styles from './UserModal.module.scss';
// import useClickOutside from '~/hooks/useClickOutside';

// const cx = classNames.bind(styles);

// function UserModal({ onClose, user, onSuccess }) {
//   const modalRef = useRef(null);
//   const [visible, setVisible] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false); // ← thêm để disable nút khi submit

//   const [formData, setFormData] = useState({
//     nameUser: user?.nameUser || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     workPosition: user?.workPosition || '',
//   });

//   // Nên dùng prefix chuẩn nếu backend đã sửa router
//   const API_URL = `${process.env.REACT_APP_BASE_URL}/api/admin/users`; // ← sửa nếu cần

//   useEffect(() => {
//     const timer = setTimeout(() => setVisible(true), 10);
//     return () => clearTimeout(timer);
//   }, []);

//   useClickOutside([modalRef], () => handleClose());

//   const handleClose = () => {
//     setVisible(false);
//     setTimeout(() => {
//       onClose && onClose();
//     }, 200);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return; // tránh submit nhiều lần

//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         showToast('Vui lòng đăng nhập lại!', 'error');
//         return;
//       }

//       const url = user ? `${API_URL}/${user._id}` : API_URL;
//       const method = user ? 'PUT' : 'POST'; // hoặc đổi PUT → PATCH nếu backend dùng PATCH

//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`, // ← ★ Quan trọng: thêm token để backend check admin
//         },
//         body: JSON.stringify(formData),
//       });

//       let data;
//       try {
//         data = await res.json();
//       } catch {
//         data = { message: 'Lỗi server không trả về JSON' };
//       }

//       if (res.ok) {
//         showToast(
//           user
//             ? 'Cập nhật người dùng thành công!'
//             : 'Thêm người dùng thành công! (Mật khẩu mặc định: 123456)',
//           'success'
//         );

//         const newUserFromServer = data.user || { ...formData, _id: 'temp-' + Date.now(), password: undefined };
//         setTimeout(() => {
//           onSuccess && onSuccess();
//           onSuccess(newUserFromServer);
//           handleClose();
//         }, 1000);
//       } else {
//         showToast(data.message || 'Không thể lưu dữ liệu!', 'error');
//       }
//     } catch (error) {
//       console.error('Lỗi submit modal:', error);
//       showToast('Lỗi kết nối server!', 'error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div className={cx('overlay', { 'overlay-show': visible })}>
//         <div ref={modalRef} className={cx('modal', { 'modal-show': visible })}>
//           <h2>{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</h2>

//           <form className={cx('form')} onSubmit={handleSubmit}>
//             <input
//               className={cx('form-input')}
//               type="text"
//               name="nameUser"
//               value={formData.nameUser}
//               onChange={handleChange}
//               placeholder="Tên người dùng"
//               required
//             />
//             <input
//               className={cx('form-input')}
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email"
//               required
//             />
//             <input
//               className={cx('form-input')}
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="Số điện thoại"
//               // required nếu backend bắt buộc
//             />
//             <input
//               className={cx('form-input')}
//               type="text"
//               name="workPosition"
//               value={formData.workPosition}
//               onChange={handleChange}
//               placeholder="Vị trí làm việc"
//             />

//             <div className={cx('actions')}>
//               <button
//                 type="button"
//                 onClick={handleClose}
//                 className={cx('cancel')}
//                 disabled={isSubmitting}
//               >
//                 Hủy
//               </button>
//               <button
//                 type="submit"
//                 className={cx('save')}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Đang lưu...' : 'Lưu'}
//               </button>
//             </div>
//           </form>

//           <button className={cx('close-btn')} onClick={handleClose}>
//             ✕
//           </button>
//         </div>
//       </div>

//       {toast && (
//         <div className={cx('toast', toast.type)}>
//           {toast.type === 'error' ? '❌ ' : '✅ '}
//           {toast.message}
//         </div>
//       )}
//     </>
//   );
// }

// export default UserModal;

//=======================================
// import React, { useRef, useState, useEffect } from 'react';
// import classNames from 'classnames/bind';
// import styles from './UserModal.module.scss';
// import useClickOutside from '~/hooks/useClickOutside';

// const cx = classNames.bind(styles);

// function UserModal({ onClose, user, onSuccess }) {
//     const modalRef = useRef(null);
//     const [visible, setVisible] = useState(false);
//     const [toast, setToast] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const [formData, setFormData] = useState({
//         name: user?.name || '',
//         email: user?.email || '',
//         phone: user?.phone || '',
//         // workPosition: user?.workPosition || '',
//     });

//     const API_URL = `${process.env.REACT_APP_BASE_URL}/api/admin/users`;

//     useEffect(() => {
//         const timer = setTimeout(() => setVisible(true), 10);
//         return () => clearTimeout(timer);
//     }, []);

//     useClickOutside([modalRef], () => handleClose());

//     const handleClose = () => {
//         setVisible(false);
//         setTimeout(() => {
//             onClose && onClose();
//         }, 200);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const showToast = (message, type = 'success') => {
//         setToast({ message, type });
//         setTimeout(() => setToast(null), 3000);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (isSubmitting) return;

//         setIsSubmitting(true);

//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 showToast('Vui lòng đăng nhập lại!', 'error');
//                 return;
//             }

//             const url = user ? `${API_URL}/${user._id}` : API_URL;
//             const method = user ? 'PUT' : 'POST';

//             const res = await fetch(url, {
//                 method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify(formData),
//             });

//             let data;
//             try {
//                 data = await res.json();
//             } catch {
//                 data = { message: 'Lỗi server không trả về JSON' };
//             }

//             if (res.ok) {
//                 showToast(
//                     user
//                         ? 'Cập nhật người dùng thành công!'
//                         : 'Thêm người dùng thành công! (Mật khẩu mặc định: 123456)',
//                     'success',
//                 );

//                 // Lấy user từ response (backend nên trả full user object)
//                 const updatedUser = data.user || {
//                     ...formData,
//                     _id: data._id || 'temp-' + Date.now(),
//                     isDeleted: false,
//                     password: undefined,
//                 };

//                 setTimeout(() => {
//                     onSuccess(updatedUser); // chỉ gọi 1 lần, truyền user
//                     handleClose();
//                 }, 1000);
//             } else {
//                 showToast(data.message || 'Không thể lưu dữ liệu!', 'error');
//             }
//         } catch (error) {
//             console.error('Lỗi submit modal:', error);
//             showToast('Lỗi kết nối server!', 'error');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <>
//             <div className={cx('overlay', { 'overlay-show': visible })}>
//                 <div ref={modalRef} className={cx('modal', { 'modal-show': visible })}>
//                     <h2>{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</h2>

//                     <form className={cx('form')} onSubmit={handleSubmit}>
//                         <input
//                             className={cx('form-input')}
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             placeholder="Tên người dùng"
//                             required
//                         />
//                         <input
//                             className={cx('form-input')}
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             placeholder="Email"
//                             required
//                         />
//                         <input
//                             className={cx('form-input')}
//                             type="tel"
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleChange}
//                             placeholder="Số điện thoại"
//                         />
//                         {/* <input
//                             className={cx('form-input')}
//                             type="text"
//                             name="workPosition"
//                             value={formData.workPosition}
//                             onChange={handleChange}
//                             placeholder="Vị trí làm việc"
//                         /> */}

//                         <div className={cx('actions')}>
//                             <button
//                                 type="button"
//                                 onClick={handleClose}
//                                 className={cx('cancel')}
//                                 disabled={isSubmitting}
//                             >
//                                 Hủy
//                             </button>
//                             <button type="submit" className={cx('save')} disabled={isSubmitting}>
//                                 {isSubmitting ? 'Đang lưu...' : 'Lưu'}
//                             </button>
//                         </div>
//                     </form>

//                     <button className={cx('close-btn')} onClick={handleClose}>
//                         ✕
//                     </button>
//                 </div>
//             </div>

//             {toast && (
//                 <div className={cx('toast', toast.type)}>
//                     {toast.type === 'error' ? '❌ ' : '✅ '}
//                     {toast.message}
//                 </div>
//             )}
//         </>
//     );
// }

// export default UserModal;

// ====================================
import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './UserModal.module.scss';
// XÓA import useClickOutside vì không dùng nữa

const cx = classNames.bind(styles);

function UserModal({ onClose, user, onSuccess }) {
  const modalRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || user?.nameUser || '',
    email: user?.email || '',
    phone: user?.phone || '',
    // workPosition: user?.workPosition || '',
  });

  const API_URL = `${process.env.REACT_APP_BASE_URL}/api/admin/users`;

  // Animation fade-in
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

//   // Click ngoài modal – chỉ gắn sau khi modal visible (đã đúng như bạn sửa)
//   useEffect(() => {
//     if (!visible) return;

//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         console.log("Click ngoài modal → đóng");
//         handleClose();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [visible]);

  const handleClose = () => {
    console.log("handleClose được gọi lúc:", new Date().toLocaleTimeString());
    setVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Vui lòng đăng nhập lại!', 'error');
        return;
      }

      const url = user ? `${API_URL}/${user._id}` : API_URL;
      const method = user ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: 'Lỗi server không trả về JSON' };
      }

      if (res.ok) {
        showToast(
          user
            ? 'Cập nhật người dùng thành công!'
            : 'Thêm người dùng thành công! (Mật khẩu mặc định: 123456)',
          'success'
        );

        const updatedUser = data.user || {
          ...formData,
          _id: data._id || 'temp-' + Date.now(),
          isDeleted: false,
          password: undefined,
        };

        setTimeout(() => {
          onSuccess(updatedUser);
          handleClose();
        }, 1000);
      } else {
        showToast(data.message || 'Không thể lưu dữ liệu!', 'error');
      }
    } catch (error) {
      console.error('Lỗi submit modal:', error);
      showToast('Lỗi kết nối server!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={cx('overlay', { 'overlay-show': visible })}>
        <div ref={modalRef} className={cx('modal', { 'modal-show': visible })}>
          <h2>{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</h2>

          <form className={cx('form')} onSubmit={handleSubmit}>
            <input
              className={cx('form-input')}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tên người dùng"
              required
            />
            <input
              className={cx('form-input')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              className={cx('form-input')}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
            />

            <div className={cx('actions')}>
              <button
                type="button"
                onClick={handleClose}
                className={cx('cancel')}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button type="submit" className={cx('save')} disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>

          <button className={cx('close-btn')} onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>

      {toast && (
        <div className={cx('toast', toast.type)}>
          {toast.type === 'error' ? '❌ ' : '✅ '}
          {toast.message}
        </div>
      )}
    </>
  );
}

export default UserModal;