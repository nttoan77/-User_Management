// import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faClock, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
// import classNames from 'classnames/bind';
// import styles from './listCV.module.scss';

// import showDeleteConfirm from '~/components/DeleteConfirmModal/DeleteConfirmModal';

// const cx = classNames.bind(styles);

// const CVList = ({ cvList, onCreateNew, onSelectCV, onDeleteCV }) => {
//     const PLACEHOLDER_IMAGES = [
//         'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/483329VcW/anh-mo-ta.png',
//         'https://antimatter.vn/wp-content/uploads/2022/03/hinh-nen-may-tinh-1080x1920-toi-gian.jpg',
//         'https://cellphones.com.vn/sforum/wp-content/uploads/2023/08/hinh-nen-desktop-50.jpg',
//         'https://aothungame.vn/wp-content/uploads/hinh-nen-may-tinh-dep-15.jpg',
//         'https://toigingiuvedep.vn/wp-content/uploads/2021/01/tai-hinh-nen-toi-gian-dep-cho-may-tinh-dien-thoai-14.jpg',
//         'https://cdnv2.tgdd.vn/mwg-static/common/News/1586975/hinh-nen-may-tinh-chill%20%2811%29.jpg',
//         'https://e1.pxfuel.com/desktop-wallpaper/535/254/desktop-wallpaper-colorful-landscape-illustration-ultra-backgrounds-for-widescreen-ultrawide-laptop-multi-display-dual-triple-monitor-tablet-smartphone-2d-landscape.jpg',
//         'https://png.pngtree.com/thumb_back/fh260/background/20251101/pngtree-aesthetic-anime-girl-under-pastel-sakura-petals-image_20162570.webp',
//         'https://i.pinimg.com/originals/c4/0a/c1/c40ac16ba30f40be595c58b0ad8aea1b.jpg',
//         'https://img5.thuthuatphanmem.vn/uploads/2022/01/16/anh-nen-anime-phong-canh-hd-dep-nhat_033741854.jpg',
//     ];

    


//     const getRandomPlaceholder = () => {
//         const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
//         return PLACEHOLDER_IMAGES[randomIndex];
//     };

//     // ================= DELETE (SOFT DELETE) =================
//     const handleDelete = (cvId, e) => {
//         e.stopPropagation();

//         showDeleteConfirm({
//             title: 'Xóa CV này?',
//             text: 'CV sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau.',
//             confirmButtonText: 'Xóa CV',
//             successText: 'CV đã được chuyển vào thùng rác.',
//             onConfirm: async () => {
//                 await onDeleteCV(cvId);
//             },
//         });
//     };

//     return (
//         <>
//             {cvList.length === 0 ? (
//                 <div className={cx('empty-state')}>
//                     <h2 className={cx('empty-title')}>Bạn chưa có CV nào</h2>
//                     <p className={cx('empty-description')}>Hãy tạo CV đầu tiên để sẵn sàng ứng tuyển!</p>
//                     <button className={cx('create-first-cv-btn')} onClick={onCreateNew}>
//                         <FontAwesomeIcon icon={faPlus} /> Tạo CV đầu tiên
//                     </button>
//                 </div>
//             ) : (
//                 <div className={cx('cv-grid')}>
                   
//                     {/* CREATE NEW */}
//                     <div className={cx('cv-card', 'create-new')} onClick={onCreateNew}>
//                         <div className={cx('create-new-inner')}>
//                             <FontAwesomeIcon icon={faPlus} className={cx('plus-icon-large')} />
//                             <h3>Tạo CV mới</h3>
//                             <p>Chọn mẫu đẹp và chuyên nghiệp</p>
//                         </div>
//                     </div>

//                     {/* CV LIST - ★★★ ĐÃ CHỮA ★★★: Thêm key prefix + check cv._id hợp lệ để tránh render card cũ */}
//                     {cvList
//                         .filter((cv) => cv && cv._id && typeof cv._id === 'string') // Loại bỏ item không hợp lệ
//                         .map((cv) => (
//                             <div
//                                 key={`cv-card-${cv._id}`} // ★★★ ĐÃ CHỮA ★★★: Thêm prefix key để React buộc re-render mới khi ID thay đổi
//                                 className={cx('cv-card', 'cv-item')}
//                                 onClick={() => onSelectCV(cv)}
//                             >
//                                 <div className={cx('cv-preview')}>
//                                    <div className={cx('btn')}>
                                       
//                                         <button
//                                             className={cx('btn-edit')}
//                                             onClick={(e) => handleDelete(cv._id, e)}
//                                             title="edit CV"
//                                         >
//                                             <FontAwesomeIcon icon={faPenToSquare} />
//                                         </button>
//                                         <button
//                                             className={cx('btn-clear')}
//                                             onClick={(e) => handleDelete(cv._id, e)}
//                                             title="Xóa CV"
//                                         >
//                                             <FontAwesomeIcon icon={faTrashCan} />
//                                         </button>
//                                    </div>

//                                     <img
//                                         src={cv.previewUrl || getRandomPlaceholder()}
//                                         alt="Preview CV"
//                                         className={cx('preview-img')}
//                                     />

//                                     <div className={cx('preview-overlay')}>
//                                         <h3 className={cx('overlay-title')}>{cv.title || 'CV chưa có tiêu đề'}</h3>

//                                         <div className={cx('cv-footer')}>
//                                             <span className={cx('updated-at')}>
//                                                 <FontAwesomeIcon icon={faClock} />
//                                                 {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                 </div>
//             )}
//         </>
//     );
// };

// export default CVList;


// =======================================

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClock, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './listCV.module.scss';

import showDeleteConfirm from '~/components/DeleteConfirmModal/DeleteConfirmModal';

const cx = classNames.bind(styles);

const PLACEHOLDER_IMAGES = [
  'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/483329VcW/anh-mo-ta.png',
  'https://antimatter.vn/wp-content/uploads/2022/03/hinh-nen-may-tinh-1080x1920-toi-gian.jpg',
  'https://cellphones.com.vn/sforum/wp-content/uploads/2023/08/hinh-nen-desktop-50.jpg',
  'https://aothungame.vn/wp-content/uploads/hinh-nen-may-tinh-dep-15.jpg',
  'https://cdnv2.tgdd.vn/mwg-static/common/News/1586975/hinh-nen-may-tinh-chill%20%2811%29.jpg',
  'https://png.pngtree.com/thumb_back/fh260/background/20251101/pngtree-aesthetic-anime-girl-under-pastel-sakura-petals-image_20162570.webp',
  'https://i.pinimg.com/originals/c4/0a/c1/c40ac16ba30f40be595c58b0ad8aea1b.jpg',
  'https://img5.thuthuatphanmem.vn/uploads/2022/01/16/anh-nen-anime-phong-canh-hd-dep-nhat_033741854.jpg',
];

const CVList = ({ cvList, onCreateNew, onSelectCV, onDeleteCV, onEditCV }) => {
  const [deletingId, setDeletingId] = useState(null); // ✅ CHỮA: track id đang xóa để disable button

  const getRandomPlaceholder = () => {
    const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
    return PLACEHOLDER_IMAGES[randomIndex];
  };

  // ================= DELETE (SOFT DELETE) =================
  const handleDelete = (cvId, e) => {
    e.stopPropagation();
    if (deletingId === cvId) return; // tránh click liên tục

    setDeletingId(cvId);

    showDeleteConfirm({
      title: 'Xóa CV này?',
      text: 'CV sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau.',
      confirmButtonText: 'Xóa CV',
      successText: 'CV đã được chuyển vào thùng rác.',
      onConfirm: async () => {
        await onDeleteCV(cvId);
        setDeletingId(null);
      },
      onCancel: () => setDeletingId(null),
    });
  };

  // ✅ CHỮA: hàm edit (gọi prop onEditCV nếu có, hoặc navigate trực tiếp)
  const handleEdit = (cvId, e) => {
    e.stopPropagation();
    if (onEditCV) {
      onEditCV(cvId);
    } else {
      // Nếu parent không truyền prop, fallback navigate
      window.location.href = `/edit/${cvId}`;
    }
  };

  return (
    <>
      {cvList.length === 0 ? (
        <div className={cx('empty-state')}>
          <h2 className={cx('empty-title')}>Bạn chưa có CV nào</h2>
          <p className={cx('empty-description')}>Hãy tạo CV đầu tiên để sẵn sàng ứng tuyển!</p>
          <button className={cx('create-first-cv-btn')} onClick={onCreateNew}>
            <FontAwesomeIcon icon={faPlus} /> Tạo CV đầu tiên
          </button>
        </div>
      ) : (
        <div className={cx('cv-grid')}>
          {/* CREATE NEW - giữ nguyên */}
          <div className={cx('cv-card', 'create-new')} onClick={onCreateNew}>
            <div className={cx('create-new-inner')}>
              <FontAwesomeIcon icon={faPlus} className={cx('plus-icon-large')} />
              <span className={cx('create-new-label')}>Tạo CV mới</span>
              <h3>Tạo CV mới</h3>
              <p>Chọn mẫu đẹp và chuyên nghiệp</p>
            </div>
          </div>

          {/* CV LIST */}
          {cvList
            .filter((cv) => cv && cv._id && typeof cv._id === 'string') // ✅ CHỮA: lọc item không hợp lệ để tránh crash
            .map((cv) => (
              <div
                key={cv._id} // ✅ CHỮA: dùng cv._id làm key chính (ổn định, không cần prefix)
                className={cx('cv-card', 'cv-item')}
                onClick={() => onSelectCV(cv)}
              >
                <div className={cx('cv-preview')}>
                  {/* ✅ CHỮA: fix button - edit gọi handleEdit, delete gọi handleDelete */}
                  <div className={cx('btn')}>
                    <button
                      className={cx('btn-edit')}
                      onClick={(e) => handleEdit(cv._id, e)}
                      title="Chỉnh sửa CV"
                      disabled={deletingId === cv._id} // ✅ CHỮA: disable khi đang xóa
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>

                    <button
                      className={cx('btn-clear')}
                      onClick={(e) => handleDelete(cv._id, e)}
                      title="Xóa CV"
                      disabled={deletingId === cv._id} // ✅ CHỮA: disable khi đang xóa
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>

                  <img
                    src={cv.previewUrl || getRandomPlaceholder()}
                    alt="Preview CV"
                    className={cx('preview-img')}
                    onError={(e) => {
                      e.target.src = getRandomPlaceholder(); // ✅ CHỮA: fallback nếu ảnh lỗi
                    }}
                  />

                  <div className={cx('preview-overlay')}>
                    <h3 className={cx('overlay-title')}>{cv.title || 'CV chưa có tiêu đề'}</h3>

                    <div className={cx('cv-footer')}>
                      <span className={cx('updated-at')}>
                        <FontAwesomeIcon icon={faClock} />
                        {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default CVList;