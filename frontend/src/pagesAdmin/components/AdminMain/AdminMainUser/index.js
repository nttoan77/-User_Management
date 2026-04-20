import UserTable from './UserTable/UserTable';
import UserModal from './UserModal/UserModal';
import DeletedUserTable from './DeletedUserTable/DeletedUserTable';
import classNames from 'classnames/bind';
import style from './index.module.scss';

const cx = classNames.bind(style);

function AdminMainUser({
    viewDeleted,
    setViewDeleted,
    filteredUsers,
    deletedUsers,
    selectedUser,
    showModal,
    setSelectedUser,
    setShowModal,
    handleDelete,
    handleRestore,
    handleDeletePermanent,
    handleChangeRole,
    setUsers,
    setFilteredUsers,
}) {
    return (
        <div>
            <div className={cx('tab-buttons')}>
                <button
                    className={cx('tab-buttons-user', { active: !viewDeleted })}
                    onClick={() => setViewDeleted(false)}
                >
                    Người dùng hoạt động
                </button>
                <button
                    className={cx('tab-buttons-delete', { active: viewDeleted })}
                    onClick={() => setViewDeleted(true)}
                >
                    Người dùng đã xóa
                </button>
            </div>

            {!viewDeleted ? (
                <UserTable
                    users={filteredUsers}
                    onEdit={(user) => {
                        setSelectedUser(user);
                        setShowModal(true);
                    }}
                    onDelete={handleDelete}
                    onChangeRole={handleChangeRole}
                />
            ) : (
                <DeletedUserTable
                    onEdit={(user) => {
                        setSelectedUser(user);
                        setShowModal(true);
                    }}
                    users={deletedUsers}
                    onRestore={handleRestore}
                    onDeletePermanent={handleDeletePermanent}
                />
            )}

            {showModal && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setShowModal(false)}
                    onSuccess={(updatedUser) => {
                        setShowModal(false);

                        if (selectedUser) {
                            // Edit mode: cập nhật user hiện có
                            setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
                            setFilteredUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
                        } else {
                            // Create mode: thêm user mới vào đầu
                            setUsers((prev) => [updatedUser, ...prev]);
                            setFilteredUsers((prev) => [updatedUser, ...prev]);
                        }

                        // Optional: refetch sau vài giây để đồng bộ nếu cần
                        // setTimeout(fetchActiveUsers, 2000);
                    }}
                />
            )}
        </div>
    );
}

export default AdminMainUser;
