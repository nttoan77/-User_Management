// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import httpRequest from '~/utils/httpRequest';
// import classNames from 'classnames/bind';
// import styles from './ChooseCV.module.scss';
// import HeaderChooseCV from './headerChooseCV/hearderChooseCV';
// import CVList from './listCV/listCV';
// import SearchCV from '../search/search';

// const cx = classNames.bind(styles);

// function ChooseCV() {
//     const [cvList, setCvList] = useState([]);
//     const [cvs, setCvs] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     // loading list cv
//     const fetchMyCVs = async () => {
//         try {
//             setLoading(true);

//             const res = await fetch('/api/cv', {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });

//             const data = await res.json();

//             if (data.success) {
//                 setCvs(data.data);
//             }
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // hangle search
//     const handleSearch = (keyword) => {
//   if (!keyword.trim()) {
//     setCvs(cvList);
//     return;
//   }

//   const filtered = cvList.filter((cv) =>
//     cv.nameCV?.toLowerCase().includes(keyword.toLowerCase())
//   );

//   setCvs(filtered);
// };

//     useEffect(() => {
//         fetchMyCVs();
//     }, []);

//     // ================= FETCH CV LIST =================
//     const fetchCVs = async () => {
//         try {
//             const res = await httpRequest.get('/api/cv');
//             const cvs = res.data?.data || res.data || [];
//             const validCvs = Array.isArray(cvs) ? cvs : [];

//             // ★★★ ĐÃ CHỮA ★★★: Lọc bỏ các ID có thể đã xóa (dự phòng nếu API trả nhầm)
//             setCvList(validCvs.filter((cv) => cv && cv._id && typeof cv._id === 'string'));

//             console.log('Danh sách CV đã được cập nhật:', validCvs.length, 'CV');
//             console.log(
//                 'Danh sách ID hiện tại:',
//                 validCvs.map((cv) => cv._id),
//             ); // Debug quan trọng
//         } catch (err) {
//             console.error('❌ Lỗi load CV', err);
//         }
//     };

//     useEffect(() => {
//         const init = async () => {
//             setLoading(true);
//             await fetchCVs();
//             setLoading(false);
//         };
//         init();

//         // ★★★ ĐÃ CHỮA ★★★: Refetch khi focus lại (quay từ trang tạo/chi tiết/trash)
//         const handleFocus = () => {
//             console.log('Trang ChooseCV được focus lại → refetch danh sách CV mới nhất');
//             fetchCVs();
//         };

//         window.addEventListener('focus', handleFocus);

//         // Thêm refetch khi component mount lần đầu + focus
//         const timer = setTimeout(fetchCVs, 1000); // Dự phòng nếu lần đầu fetch chậm

//         return () => {
//             window.removeEventListener('focus', handleFocus);
//             clearTimeout(timer);
//         };
//     }, []);

//     // ================= DELETE (SOFT) =================
//     const handleDeleteCV = async (cvId) => {
//         // Optimistic UI: xóa tạm thời
//         const oldList = [...cvList];
//         setCvList((prev) => prev.filter((cv) => cv._id !== cvId));

//         try {
//             await httpRequest.delete(`/api/cv/${cvId}`);
//             // ★★★ ĐÃ CHỮA ★★★: Refetch lại toàn bộ để chắc chắn không còn ID cũ
//             await fetchCVs();
//             console.log(`Đã xóa mềm CV ${cvId} và refetch thành công`);
//         } catch (err) {
//             console.error('Lỗi xóa CV', err);
//             // Rollback
//             setCvList(oldList);
//         }
//     };

//     const handleSelectCV = (cv) => {
//         if (!cv || !cv._id) {
//             console.warn('CV không hợp lệ, không navigate');
//             return;
//         }
//         console.log('Chọn CV để xem chi tiết:', cv._id); // Debug
//         navigate(`/cv/${cv._id}`);
//     };

//     const handleCreateNew = () => {
//         navigate('/regis-Information-CV');
//     };

//     if (loading) return <p>Đang tải...</p>;

//     return (
//         <div className={cx('container')}>
//             <HeaderChooseCV />

//             <div className={cx('main-content')}>
//                 <h1 className={cx('main-content-c')}>Hồ sơ CV của bạn</h1>

//                 <div className={cx('search-cv')}>
//                     <SearchCV onSearch={handleSearch} />

//                     {loading && <p>Đang tải...</p>}

//                     {!loading && cvs.length === 0 && <p>Không có CV</p>}

//                     {cvs.map((cv) => (
//                         <div key={cv._id}>
//                             <h3>{cv.nameCV}</h3>
//                         </div>
//                     ))}
//                 </div>

//                 <div className={cx('delete-soft')} onClick={() => navigate('/cv/trash')}>
//                     🗑️ Thùng rác
//                 </div>

//                 <CVList
//                     cvList={cvList}
//                     onCreateNew={handleCreateNew}
//                     onSelectCV={handleSelectCV}
//                     onDeleteCV={handleDeleteCV}
//                 />
//             </div>
//         </div>
//     );
// }

// export default ChooseCV;

import React, { useEffect, useState ,useCallback  } from 'react';
import { useNavigate } from 'react-router-dom';
import httpRequest from '~/utils/httpRequest';
import classNames from 'classnames/bind';
import styles from './ChooseCV.module.scss';
import HeaderChooseCV from './headerChooseCV/hearderChooseCV';
import CVList from './listCV/listCV';
import SearchCV from '../search/search';

const cx = classNames.bind(styles);

function ChooseCV() {
    // 🔧 CHANGED: cvList = dữ liệu gốc
    const [cvList, setCvList] = useState([]);

    // 🔧 CHANGED: displayCVs = dữ liệu hiển thị (search)
    const [displayCVs, setDisplayCVs] = useState([]);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /* =====================================================
       🔧 CHANGED: CHỈ FETCH 1 LẦN – SET CẢ 2 STATE
    ===================================================== */
    const fetchCVs = async () => {
        try {
            setLoading(true);

            const res = await httpRequest.get('/api/cv');
            const data = res.data?.data || [];

            const validCVs = data.filter((cv) => cv && cv._id);

            setCvList(validCVs); // 🔒 dữ liệu gốc
            setDisplayCVs(validCVs); // 👁️ dữ liệu hiển thị ban đầu
        } catch (err) {
            console.error('❌ Lỗi load CV', err);
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       🔧 CHANGED: SEARCH = FILTER LOCAL
    ===================================================== */
    // const handleSearch = (keyword) => {
    //     if (!keyword.trim()) {
    //         setDisplayCVs(cvList); // 🔁 trả lại danh sách gốc
    //         return;
    //     }

    //     const filtered = cvList.filter((cv) => cv.nameCV?.toLowerCase().includes(keyword.toLowerCase()));

    //     setDisplayCVs(filtered);
    // };

    const handleSearch = useCallback(
        (keyword) => {
          if (!keyword.trim()) {
            setDisplayCVs(cvList);
            return;
          }
      
          const lowerKeyword = keyword.toLowerCase();
      
          const filtered = cvList.filter((cv) =>
            cv.nameCV?.toLowerCase().includes(lowerKeyword)
          );
      
          setDisplayCVs(filtered);
        },
        [cvList] // 🔒 cố định reference
      );
    /* =====================================================
       🔧 CHANGED: FETCH KHI MOUNT
    ===================================================== */
    useEffect(() => {
        fetchCVs();
    }, []);

    /* =====================================================
       🔧 CHANGED: DELETE – UPDATE CẢ 2 STATE
    ===================================================== */
    const handleDeleteCV = async (cvId) => {
        const oldList = [...cvList];

        // Optimistic UI
        setCvList((prev) => prev.filter((cv) => cv._id !== cvId));
        setDisplayCVs((prev) => prev.filter((cv) => cv._id !== cvId));

        try {
            await httpRequest.delete(`/api/cv/${cvId}`);
        } catch (err) {
            console.error('Lỗi xóa CV', err);
            // rollback
            setCvList(oldList);
            setDisplayCVs(oldList);
        }
    };

    const handleSelectCV = (cv) => {
        if (!cv || !cv._id) return;
        navigate(`/cv/${cv._id}`);
    };

    const handleCreateNew = () => {
        navigate('/regis-Information-CV');
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className={cx('container')}>
           

            <div className={cx('main-content')}>
                <h1 className={cx('main-content-c')}>Hồ sơ CV của bạn</h1>

                <div className={cx('main-content-header')}>
                    <div className={cx('search-cv')}>
                        <SearchCV onSearch={handleSearch} />

                        {!loading && displayCVs.length === 0 && <p>Không có CV</p>}
                    </div>

                    <div className={cx('delete-soft')} onClick={() => navigate('/cv/trash')}>
                        🗑️ Thùng rác
                    </div>
                </div>

                {/* 🔧 CHANGED: CVList dùng displayCVs */}
                <CVList
                    cvList={displayCVs}
                    onCreateNew={handleCreateNew}
                    onSelectCV={handleSelectCV}
                    onDeleteCV={handleDeleteCV}
                />
            </div>
        </div>
    );
}

export default ChooseCV;
