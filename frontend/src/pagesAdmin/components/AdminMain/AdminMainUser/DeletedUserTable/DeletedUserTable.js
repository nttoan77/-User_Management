// import React from "react";
// import classNames from "classnames/bind";
// import styles from "./DeletedUserTable.module.scss";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUndo, faTrash } from "@fortawesome/free-solid-svg-icons";

// import useAlert from "~/hooks/useAlert"; // ✅ import hook cảnh báo
// import AlertBox from "~/components/AlertBox/AlertBox"; // ✅ import component hiển thị cảnh báo

// const cx = classNames.bind(styles);

// const DeletedUserTable = ({ users, onRestore, onDeletePermanent }) => {
//   const { alert, showAlert } = useAlert(); // ✅ khởi tạo hook cảnh báo

//   // 👉 Khi khôi phục thành công
//   const handleRestore = async (id) => {
//     try {
//       await onRestore(id);
//       showAlert("success", " Khôi phục người dùng thành công!");
//     } catch (err) {
//       showAlert("error", "❌ Không thể khôi phục người dùng!");
//     }
//   };

//   // 👉 Khi xóa vĩnh viễn
//   const handleDeletePermanent = async (id) => {
//     const confirmDelete = window.confirm(
//       "⚠️ Bạn có chắc muốn xóa vĩnh viễn người dùng này không?"
//     );
//     if (!confirmDelete) return;

//     try {
//       await onDeletePermanent(id);
//       showAlert("warning", " Đã xóa vĩnh viễn người dùng!");
//     } catch (err) {
//       showAlert("error", "❌ Không thể xóa người dùng!");
//     }
//   };

//   return (
//     <div className={cx("deleted-wrapper")}>
//       {/* ✅ hiển thị cảnh báo */}
//       <AlertBox alert={alert} />

//       <table className={cx("deleted-table")}>
//         <thead>
//           <tr>
//             <th>Tên</th>
//             <th>Email</th>
//             <th>Số điện thoại</th>
//             <th>Vị trí</th>
//             <th>Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length === 0 ? (
//             <tr>
//               <td colSpan="5" style={{ textAlign: "center", color: "#888" }}>
//                 Không có người dùng nào trong thùng rác
//               </td>
//             </tr>
//           ) : (
//             users.map((user) => (
//               <tr key={user._id}>
//                 <td>{user.nameUser}</td>
//                 <td>{user.email}</td>
//                 <td>{user.phone}</td>
//                 <td>{user.workPosition}</td>
//                 <td>
//                   <button
//                     onClick={() => handleRestore(user._id)}
//                     className={cx("restore-btn")}
//                   >
//                     <FontAwesomeIcon icon={faUndo} /> Khôi phục
//                   </button>
//                   <button
//                     onClick={() => handleDeletePermanent(user._id)}
//                     className={cx("delete-btn")}
//                   >
//                     <FontAwesomeIcon icon={faTrash} /> Xóa vĩnh viễn
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DeletedUserTable;

// ==============================
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './DeletedUserTable.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faTrash } from '@fortawesome/free-solid-svg-icons';

import useAlert from '~/hooks/useAlert';
import AlertBox from '~/components/AlertBox/AlertBox';

const cx = classNames.bind(styles);

const DeletedUserTable = ({ users, onRestore, onDeletePermanent,onEdit }) => {
    const { alert, showAlert } = useAlert();

    // Loading state cho từng user (dùng object để theo dõi id)
    const [loading, setLoading] = useState({});

    const handleRestore = async (id, user) => {
        if (loading[id]) return; // tránh click nhiều lần

        setLoading((prev) => ({ ...prev, [id]: true }));

        try {
            await onRestore(id);
            showAlert('success', 'Khôi phục người dùng thành công!');
        } catch (err) {
            showAlert('error', 'Không thể khôi phục người dùng!');
            console.error('Lỗi khôi phục:', err);
        } finally {
            setLoading((prev) => ({ ...prev, [id]: false }));
        }
        
    };

    const handleDeletePermanent = async (id) => {
        if (loading[id]) return;

        const confirmDelete = window.confirm(
            '⚠️ CẢNH BÁO: HÀNH ĐỘNG KHÔNG THỂ HOÀN TÁC\n\n' +
                'Bạn có chắc chắn muốn XÓA VĨNH VIỄN người dùng này?\n' +
                'Toàn bộ dữ liệu liên quan sẽ bị mất hoàn toàn.',
        );

        if (!confirmDelete) return;

        setLoading((prev) => ({ ...prev, [id]: true }));

        try {
            await onDeletePermanent(id);
            showAlert('warning', 'Đã xóa vĩnh viễn người dùng!');
        } catch (err) {
            showAlert('error', 'Không thể xóa vĩnh viễn người dùng!');
            console.error('Lỗi xóa vĩnh viễn:', err);
        } finally {
            setLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className={cx('deleted-wrapper')}>
            <AlertBox alert={alert} />

            <table className={cx('deleted-table')}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        {/* <th>Vị trí công việc</th> */}
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>
                                Không có người dùng nào trong thùng rác
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => {
                            const id = user._id;
                            const isLoading = loading[id] || false;

                            return (
                                <tr key={id}>
                                    <td>{user.name || 'Không có tên'}</td>
                                    <td>{user.email || '—'}</td>
                                    <td>{user.phone || '—'}</td>
                                    {/* <td>{user.workPosition || '—'}</td> */}
                                    <td>
                                        <button
                                            onClick={() => handleRestore(id)}
                                            className={cx('restore-btn')}
                                            disabled={isLoading}
                                            
                                        >
                                            <FontAwesomeIcon icon={faUndo} />
                                            {isLoading ? ' Đang xử lý...' : ' Khôi phục'}
                                        </button>

                                        <button
                                            onClick={() => handleDeletePermanent(id)}
                                            className={cx('delete-btn')}
                                            disabled={isLoading}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                            {isLoading ? ' Đang xử lý...' : ' Xóa vĩnh viễn'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DeletedUserTable;
