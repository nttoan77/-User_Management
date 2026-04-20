// src/components/Admin/MainContent/AdminMainStatistics/AdminMainStatistics.jsx
import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import axios from 'axios';

// Đăng ký components Chart.js (chỉ 1 lần)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const cx = classNames.bind(styles || {});

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8888';

function AdminMainStatistics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Không tìm thấy token');

                const res = await axios.get(`${API_BASE}/api/admin/users/stats/users `, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setStats(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Lỗi tải dữ liệu thống kê');
                console.error('Lỗi fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className={cx('loading-container')}>
                <p>Đang tải dữ liệu thống kê...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cx('error-container')}>
                <h2>Lỗi</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!stats) {
        return <div>Không có dữ liệu thống kê</div>;
    }

    // Dữ liệu cho Line Chart (đăng ký theo ngày)
    const lineData = {
        labels: stats.dailyRegistrations.map((item) => item.date),
        datasets: [
            {
                label: 'Đăng ký mới',
                data: stats.dailyRegistrations.map((item) => item.count),
                borderColor: '#8884d8',
                backgroundColor: 'rgba(136, 132, 216, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Đăng ký mới theo ngày (gần đây)' },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    // Dữ liệu cho Bar Chart (theo tháng)
    const barData = {
        labels: stats.monthlyRegistrations.map((item) => item.month),
        datasets: [
            {
                label: 'Số lượng đăng ký',
                data: stats.monthlyRegistrations.map((item) => item.count),
                backgroundColor: '#82ca9d',
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Đăng ký theo tháng' },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    // Dữ liệu cho Pie Chart (phân bố vai trò)
    const pieData = {
        labels: stats.roleDistribution.map((item) => item.name),
        datasets: [
            {
                data: stats.roleDistribution.map((item) => item.value),
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28'],
                borderWidth: 1,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(0) + '%';
                        return `${label}: ${value} (${percentage})`;
                    },
                },
            },
        },
    };

    return (
        <div className={cx('statistics-page')}>
            <h1 className={cx('page-title')}>Thống kê đăng ký người dùng</h1>

            {/* KPI Cards */}
            <div className={cx('kpi-grid')}>
                <div className={cx('kpi-card', 'total')}>
                    <div className={cx('label')}>Tổng người dùng</div>
                    <div className={cx('value')}>{stats.totalUsers.toLocaleString()}</div>
                </div>

                <div className={cx('kpi-card', 'today')}>
                    <div className={cx('label')}>Mới hôm nay</div>
                    <div className={cx('value')}>{stats.newToday}</div>
                </div>

                <div className={cx('kpi-card', 'week')}>
                    <div className={cx('label')}>Mới tuần này</div>
                    <div className={cx('value')}>{stats.newThisWeek}</div>
                </div>

                <div className={cx('kpi-card', 'month')}>
                    <div className={cx('label')}>Mới tháng này</div>
                    <div className={cx('value')}>{stats.newThisMonth}</div>
                </div>

               
            </div>

            {/* Line Chart */}
            <div className={cx('chart-container')}>
                <h2>Đăng ký mới theo ngày (gần đây)</h2>
                <div style={{ height: '350px', width: '100%' }}>
                    <Line data={lineData} options={lineOptions} />
                </div>
            </div>

            {/* Bar + Pie */}
            <div className={cx('bottom-charts')}>
                <div className={cx('chart-half')}>
                    <h3>Đăng ký theo tháng</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                <div className={cx('chart-half')}>
                    <h3>Phân bố vai trò</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminMainStatistics;
