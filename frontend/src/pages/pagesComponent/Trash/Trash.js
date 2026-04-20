import { useEffect, useState } from 'react';
import { MdRestore, MdDeleteForever, MdOutlineDeleteSweep } from 'react-icons/md';
import { LuRecycle } from 'react-icons/lu';
import httpRequest from '~/utils/httpRequest';
import classNames from 'classnames/bind';
import styles from './Trash.module.scss';
import showDeleteConfirm from '~/components/DeleteConfirmModal/DeleteConfirmModal';

const cx = classNames.bind(styles);

function Trash() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});

    const fetchTrash = async () => {
        try {
            setLoading(true);
            const res = await httpRequest.get('/api/cv/trash');
            const data = res.data?.data || res.data || [];
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Lỗi khi tải thùng rác:', err);
            // Có thể thay alert bằng toast notification ở đây
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    const performAction = async (id, actionType) => {
        if (actionLoading[id]) return;

        setActionLoading((prev) => ({ ...prev, [id]: true }));

        const isRestore = actionType === 'restore';

        try {
            const method = isRestore ? 'patch' : 'delete';
            const endpoint = isRestore ? `/api/cv/${id}/restore` : `/api/cv/${id}/force`;

            await httpRequest[method](endpoint);

            // Optimistic update
            setItems((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.error(`Lỗi ${actionType}:`, err);
            // Thay alert bằng toast ở production
            alert(
                isRestore
                    ? 'Không thể khôi phục CV. Vui lòng thử lại.'
                    : 'Không thể xóa vĩnh viễn CV. Vui lòng thử lại.',
            );
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleRestore = (id) => {
        showDeleteConfirm({
            title: 'Khôi phục CV?',
            text: 'CV sẽ được đưa trở lại danh sách chính của bạn.',
            confirmButtonText: 'Khôi phục',
            cancelButtonText: 'Hủy',
            onConfirm: () => performAction(id, 'restore'),
        });
    };

    const handleForceDelete = (id) => {
        showDeleteConfirm({
            title: 'Xóa CV vĩnh viễn?',
            text: (
                <p>
                    Hành động này <br/> <strong>sẽ làm toàn bộ dữ liệu mà bạn đăng ký biến mất .</strong> <br/> bạn có chắc chắn muốn
                    xóa không <br />
                </p>
            ),
            confirmButtonText: 'Xóa vĩnh viễn',
            cancelButtonText: 'Hủy',
            danger: true,
            onConfirm: () => performAction(id, 'forceDelete'),
        });
    };

    if (loading) {
        return (
            <div className={cx('trash', 'loading')}>
                <div className={cx('skeleton-header')} />
                <div className={cx('skeleton-list')}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={cx('skeleton-card')} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cx('trash')}>
            <header className={cx('header')}>
                <div className={cx('title-wrapper')}>
                    <MdOutlineDeleteSweep className={cx('icon')} />
                    <h1>Thùng rác</h1>
                </div>
                <p className={cx('subtitle')}>
                    Các CV đã xóa sẽ được lưu trữ tại đây trong một thời gian trước khi tự động bị xóa vĩnh viễn
                </p>
            </header>

            {items.length === 0 ? (
                <div className={cx('empty-state')}>
                    <LuRecycle className={cx('empty-icon')} />
                    <h2>Thùng rác hiện đang trống</h2>
                    <p>Bạn chưa xóa CV nào. Các CV bị xóa sẽ xuất hiện ở đây.</p>
                </div>
            ) : (
                <div className={cx('items-list')}>
                    {items.map((item) => {
                        const isBusy = actionLoading[item._id];
                        const deletedDate = new Date(item.deletedAt);

                        return (
                            <div key={item._id} className={cx('trash-card', { 'is-busy': isBusy })}>
                                <div className={cx('card-main')}>
                                    <h3 className={cx('cv-title')}>{item.title || 'CV không có tiêu đề'}</h3>

                                    <div className={cx('meta')}>
                                        <span>
                                            Xóa lúc:{' '}
                                            {deletedDate.toLocaleString('vi-VN', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </span>
                                        <span className={cx('time-ago')}>{formatTimeAgo(deletedDate)}</span>
                                    </div>
                                </div>

                                <div className={cx('actions')}>
                                    <button
                                        className={cx('btn', 'btn-restore')}
                                        onClick={() => handleRestore(item._id)}
                                        disabled={isBusy}
                                    >
                                        <MdRestore size={18} />
                                        {isBusy ? 'Đang xử lý...' : 'Khôi phục'}
                                    </button>

                                    <button
                                        className={cx('btn', 'btn-delete')}
                                        onClick={() => handleForceDelete(item._id)}
                                        disabled={isBusy}
                                    >
                                        <MdDeleteForever size={18} />
                                        {isBusy ? 'Đang xử lý...' : 'Xóa vĩnh viễn'}
                                    </button>
                                </div>

                                {isBusy && <div className={cx('overlay')} />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function formatTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} năm${interval > 1 ? '' : ''} trước`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} tháng trước`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} ngày trước`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} giờ trước`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} phút trước`;

    return 'vừa xong';
}

export default Trash;
