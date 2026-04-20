import React from 'react';
import classNames from 'classnames/bind';
import styles from './UserTable.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faUserShield } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const UserTable = ({ users, onEdit, onDelete, onChangeRole, className }) => {
    const handleDeleteWithConfirm = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa mềm người dùng này?')) {
            onDelete(id);
           
        }
    };

    return (
        <table className={cx('user-table', className)}>
            <thead>
                <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    {/* <th>Vị trí</th> */}
                    <th>Quyền</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {users?.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>
                            Không có người dùng nào
                        </td>
                    </tr>
                ) : (
                    users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name || 'Không có tên'}</td>
                            <td>{user.email || '—'}</td>
                            <td>{user.phone || '—'}</td>
                            {/* <td>{user.workPosition || '—'}</td> */}
                            <td>{user.role || 'user'}</td>
                            <td>
                                <button
                                    onClick={() => onChangeRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                    className={cx('admin-btn')}
                                >
                                    <FontAwesomeIcon icon={faUserShield} />{' '}
                                    {user.role === 'admin' ? 'Gỡ quyền' : 'Phân quyền'}
                                </button>
                                <button onClick={() => onEdit(user)} className={cx('edit-btn')}>
                                    <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button onClick={() => handleDeleteWithConfirm(user._id)} className={cx('delete-btn')}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default UserTable;
