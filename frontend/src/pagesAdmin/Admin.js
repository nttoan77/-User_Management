// ==============================
// import React, { useState, useEffect } from 'react';
// import classNames from 'classnames/bind';
// import styles from './Admin.module.scss';
// import Sidebar from './components/Sidebar/Sidebar';
// import UserTable from './components/AdminMain/AdminMainUser/UserTable/UserTable';
// import UserModal from './components/AdminMain/AdminMainUser/UserModal/UserModal';
// import UserHeader from './components/AdminMain/AdminMainUser/UserHeader/UserHeader';
// import DeletedUserTable from './components/AdminMain/AdminMainUser/DeletedUserTable/DeletedUserTable';
// import axios from 'axios';
// // import AdminMainUser from './components/AdminMain/AdminMainUser';
// import { AdminMainUser, AdminMainStatistics } from './components/AdminMain';

// const cx = classNames.bind(styles);

// const Admin = () => {
//     const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8888';
//     const ADMIN_API = `${API_BASE}/api/admin/users`;

//     const [users, setUsers] = useState([]);
//     const [deletedUsers, setDeletedUsers] = useState([]);
//     const [filteredUsers, setFilteredUsers] = useState([]);
//     const [viewDeleted, setViewDeleted] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [page, setPage] = useState('users');

//     const fetchActiveUsers = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             console.error('❌ Không tìm thấy token');
//             return;
//         }

//         try {
//             const res = await axios.get(ADMIN_API, {
//                 headers: { Authorization: `Bearer ${token}` },
//                 params: { page: 1, limit: 50 },
//             });

//             const data = Array.isArray(res.data) ? res.data : res.data.data || [];
//             setUsers(data);
//             setFilteredUsers(data);
//         } catch (err) {
//             console.error('Lỗi fetch active users:', err.response?.data || err.message);
//         }
//     };

//     const fetchDeletedUsers = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) return;

//         try {
//             const res = await axios.get(`${ADMIN_API}/deleted`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             const data = Array.isArray(res.data) ? res.data : res.data.data || [];
//             setDeletedUsers(data);
//         } catch (err) {
//             console.error('Lỗi fetch deleted users:', err);
//         }
//     };

//     useEffect(() => {
//         fetchActiveUsers();
//         fetchDeletedUsers();
//     }, []);

//     const handleSearch = (query) => {
//         if (!query.trim()) {
//             setFilteredUsers(users);
//             return;
//         }
//         const lower = query.toLowerCase();
//         const filtered = users.filter(
//             (u) =>
//                 (u.nameUser || '').toLowerCase().includes(lower) ||
//                 (u.email || '').toLowerCase().includes(lower) ||
//                 (u.phone || '').toLowerCase().includes(lower),
//         );
//         setFilteredUsers(filtered);
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm('Xác nhận xóa mềm người dùng?')) return;

//         console.log('Đang xóa user ID:', id); // ← thêm log để debug

//         // Optimistic delete
//         const oldUsers = [...users]; // copy array để rollback
//         setUsers((prev) => prev.filter((u) => u._id !== id));
//         setFilteredUsers((prev) => prev.filter((u) => u._id !== id));

//         try {
//             const res = await axios.delete(`${ADMIN_API}/${id}`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });

//             fetchDeletedUsers(); // cập nhật tab đã xóa
//         } catch (err) {
//             //   console.error('Lỗi xóa user:', err.response?.data || err.message);
//             alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
//             // Rollback
//             setUsers(oldUsers);
//             setFilteredUsers(oldUsers);
//         }
//     };

//     const handleRestore = async (id) => {
//         if (!window.confirm('Khôi phục người dùng này?')) return;

//         const userToRestore = deletedUsers.find((u) => u._id === id);
//         if (!userToRestore) return;

//         // Optimistic restore
//         setDeletedUsers((prev) => prev.filter((u) => u._id !== id));
//         setUsers((prev) => [...prev, userToRestore]);
//         setFilteredUsers((prev) => [...prev, userToRestore]);

//         try {
//             await axios.patch(
//                 `${ADMIN_API}/${id}/restore`,
//                 {},
//                 {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 },
//             );
//         } catch (err) {
//             alert('Khôi phục thất bại');
//             setDeletedUsers((prev) => [...prev, userToRestore]);
//             setUsers((prev) => prev.filter((u) => u._id !== id));
//             setFilteredUsers((prev) => prev.filter((u) => u._id !== id));
//         }
//     };

//     const handleDeletePermanent = async (id) => {
//         if (!window.confirm('XÓA VĨNH VIỄN – KHÔNG THỂ HOÀN TÁC?')) return;

//         try {
//             await axios.delete(`${ADMIN_API}/${id}/permanent`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//             setDeletedUsers((prev) => prev.filter((u) => u._id !== id));
//         } catch (err) {
//             alert('Xóa vĩnh viễn thất bại');
//         }
//     };

//     const handleChangeRole = async (userId, newRole) => {
//         const oldUser = users.find((u) => u._id === userId);
//         if (!oldUser) return;

//         // Optimistic update role
//         setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
//         setFilteredUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));

//         try {
//             await axios.patch(
//                 `${ADMIN_API}/${userId}/role`,
//                 { role: newRole },
//                 { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
//             );
//         } catch (err) {
//             alert('Đổi quyền thất bại: ' + (err.response?.data?.message || ''));
//             setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: oldUser.role } : u)));
//             setFilteredUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: oldUser.role } : u)));
//         }
//     };

//     return (
//         <div className={cx('admin-container')}>
//             <Sidebar setPage={setPage} page={page} />
//             <div className={cx('admin-content')}>
//                 {/* <UserHeader
//                     onSearch={handleSearch}
//                     onAddUser={() => {
//                         setSelectedUser(null);
//                         setShowModal(true);
//                     }}
//                 />

//                 <div className={cx('tab-buttons')}>
//                     <button
//                         className={cx('tab-buttons-user', { active: !viewDeleted })}
//                         onClick={() => setViewDeleted(false)}
//                     >
//                         Người dùng hoạt động
//                     </button>
//                     <button
//                         className={cx('tab-buttons-delete', { active: viewDeleted })}
//                         onClick={() => setViewDeleted(true)}
//                     >
//                         Người dùng đã xóa
//                     </button>
//                 </div>

//                 {!viewDeleted ? (
//                     <UserTable
//                         users={filteredUsers}
//                         onEdit={(user) => {
//                             setSelectedUser(user);
//                             setShowModal(true);
//                         }}
//                         onDelete={handleDelete}
//                         onChangeRole={handleChangeRole}
//                     />
//                 ) : (
//                     <DeletedUserTable
//                         onEdit={(user) => {
//                             setSelectedUser(user);
//                             setShowModal(true);
//                         }}
//                         users={deletedUsers}
//                         onRestore={handleRestore}
//                         onDeletePermanent={handleDeletePermanent}
//                     />
//                 )}

//                 {showModal && (
//                     <UserModal
//                         user={selectedUser}
//                         onClose={() => setShowModal(false)}
//                         onSuccess={(updatedUser) => {
//                             setShowModal(false);

//                             if (selectedUser) {
//                                 // Edit mode: cập nhật user hiện có
//                                 setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
//                                 setFilteredUsers((prev) =>
//                                     prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)),
//                                 );
//                             } else {
//                                 // Create mode: thêm user mới vào đầu
//                                 setUsers((prev) => [updatedUser, ...prev]);
//                                 setFilteredUsers((prev) => [updatedUser, ...prev]);
//                             }

//                             // Optional: refetch sau vài giây để đồng bộ nếu cần
//                             // setTimeout(fetchActiveUsers, 2000);
//                         }}
//                     />
//                 )} */}

//                 {page === 'users' && (
//                     <>
//                         <UserHeader
//                             onSearch={handleSearch}
//                             onAddUser={() => {
//                                 setSelectedUser(null);
//                                 setShowModal(true);
//                             }}
//                         />

//                         <AdminMainUser
//                             viewDeleted={viewDeleted}
//                             setViewDeleted={setViewDeleted}
//                             filteredUsers={filteredUsers}
//                             deletedUsers={deletedUsers}
//                             selectedUser={selectedUser}
//                             showModal={showModal}
//                             setSelectedUser={setSelectedUser}
//                             setShowModal={setShowModal}
//                             handleDelete={handleDelete}
//                             handleRestore={handleRestore}
//                             setUsers={setUsers}
//                             setFilteredUsers={setFilteredUsers}
//                         />
//                     </>
//                 )}

//                 {page === 'statistics' && (
//                     <div>
//                         <h2>Trang thống kê</h2>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Admin;

// ============================================
import React, { Suspense, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Admin.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import UserHeader from './components/AdminMain/AdminMainUser/UserHeader/UserHeader';
import axios from 'axios';

// Import từ barrel file (đã lazy)
import { AdminMainUser, AdminMainStatistics, AdminMainSettings } from './components/AdminMain';
import UserModal from './components/AdminMain/AdminMainUser/UserModal/UserModal';

const cx = classNames.bind(styles);

const Admin = () => {
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8888';
    const ADMIN_API = `${API_BASE}/api/admin/users`;

    // State cho phần quản lý người dùng
    const [users, setUsers] = useState([]);
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [viewDeleted, setViewDeleted] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // State page
    const [page, setPage] = useState('users');

    // Fetch users khi cần
    const fetchActiveUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return console.error('❌ Không tìm thấy token');

        try {
            const res = await axios.get(ADMIN_API, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: 1, limit: 50 },
            });
            const data = Array.isArray(res.data) ? res.data : res.data.data || [];
            setUsers(data);
            setFilteredUsers(data);
        } catch (err) {
            console.error('Lỗi fetch active users:', err.response?.data || err.message);
        }
    };

    const fetchDeletedUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await axios.get(`${ADMIN_API}/deleted`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = Array.isArray(res.data) ? res.data : res.data.data || [];
            setDeletedUsers(data);
        } catch (err) {
            console.error('Lỗi fetch deleted users:', err);
        }
    };

    useEffect(() => {
        if (page === 'users') {
            fetchActiveUsers();
            fetchDeletedUsers();
        }
    }, [page]);

    // useEffect(() => {
    //     // console.log('showModal thay đổi:', showModal);
    //     // console.log('selectedUser:', selectedUser);
    // }, [showModal, selectedUser]);

    // Các handler user (copy từ code cũ của bạn)
    const handleSearch = (query) => {
        if (!query.trim()) return setFilteredUsers(users);
        const lower = query.toLowerCase();
        const filtered = users.filter(
            (u) =>
                (u.nameUser || '').toLowerCase().includes(lower) ||
                (u.email || '').toLowerCase().includes(lower) ||
                (u.phone || '').toLowerCase().includes(lower),
        );
        setFilteredUsers(filtered);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa mềm người dùng?')) return;
        const oldUsers = [...users];
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setFilteredUsers((prev) => prev.filter((u) => u._id !== id));

        try {
            await axios.delete(`${ADMIN_API}/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchDeletedUsers();
        } catch (err) {
            alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
            setUsers(oldUsers);
            setFilteredUsers(oldUsers);
        }
    };

    const handleRestore = async (id) => {
        if (!window.confirm('Khôi phục người dùng này?')) return;
        const userToRestore = deletedUsers.find((u) => u._id === id);
        if (!userToRestore) return;

        setDeletedUsers((prev) => prev.filter((u) => u._id !== id));
        setUsers((prev) => [...prev, userToRestore]);
        setFilteredUsers((prev) => [...prev, userToRestore]);

        try {
            await axios.patch(
                `${ADMIN_API}/${id}/restore`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                },
            );
        } catch (err) {
            alert('Khôi phục thất bại');
            setDeletedUsers((prev) => [...prev, userToRestore]);
            setUsers((prev) => prev.filter((u) => u._id !== id));
            setFilteredUsers((prev) => prev.filter((u) => u._id !== id));
        }
    };

    const handleDeletePermanent = async (id) => {
        if (!window.confirm('XÓA VĨNH VIỄN – KHÔNG THỂ HOÀN TÁC?')) return;
        try {
            await axios.delete(`${ADMIN_API}/${id}/permanent`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setDeletedUsers((prev) => prev.filter((u) => u._id !== id));
        } catch (err) {
            alert('Xóa vĩnh viễn thất bại');
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        const oldUser = users.find((u) => u._id === userId);
        if (!oldUser) return;

        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
        setFilteredUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));

        try {
            await axios.patch(
                `${ADMIN_API}/${userId}/role`,
                { role: newRole },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                },
            );
        } catch (err) {
            alert('Đổi quyền thất bại: ' + (err.response?.data?.message || ''));
            setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: oldUser.role } : u)));
            setFilteredUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: oldUser.role } : u)));
        }
    };

    return (
        <div className={cx('admin-container')}>
            {/* Truyền đúng props cho Sidebar */}
            <Sidebar currentPage={page} onChangePage={setPage} />

            <div className={cx('admin-content')}>
                {/* Trang Người dùng */}
                {page === 'users' && (
                    <>
                        <UserHeader
                            onSearch={handleSearch}
                            onAddUser={() => {
                                setSelectedUser(null);
                                setShowModal(true);
                                console.log('Mở modal thêm user');
                            }}
                        />

                        <AdminMainUser
                            viewDeleted={viewDeleted}
                            setViewDeleted={setViewDeleted}
                            filteredUsers={filteredUsers}
                            deletedUsers={deletedUsers}
                            selectedUser={selectedUser}
                            showModal={showModal}
                            setSelectedUser={setSelectedUser}
                            setShowModal={setShowModal}
                            handleDelete={handleDelete}
                            handleRestore={handleRestore}
                            handleDeletePermanent={handleDeletePermanent}
                            handleChangeRole={handleChangeRole}
                            setUsers={setUsers}
                            setFilteredUsers={setFilteredUsers}
                        />
                    </>
                )}

                {/* Trang Thống kê */}
                {page === 'statistics' && (
                    <Suspense
                        fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Đang tải thống kê...</div>}
                    >
                        <AdminMainStatistics />
                    </Suspense>
                )}

                {/* Thêm phần Settings */}
                {page === 'settings' && (
                    <Suspense fallback={<div className={cx('loading')}>Đang tải cài đặt...</div>}>
                        <AdminMainSettings />
                    </Suspense>
                )}
            </div>

            {/* Modal user */}
            {showModal && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setShowModal(false)}
                    onSuccess={(updatedUser) => {
                        setShowModal(false);
                        if (selectedUser) {
                            setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
                            setFilteredUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
                        } else {
                            setUsers((prev) => [updatedUser, ...prev]);
                            setFilteredUsers((prev) => [updatedUser, ...prev]);
                        }
                        fetchActiveUsers();
                    }}
                />
            )}
        </div>
    );
};

export default Admin;
