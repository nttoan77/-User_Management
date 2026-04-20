// src/components/Admin/MainContent/AdminMainStatistics/mockData.js
export const mockStats = {
    totalUsers: 12480,
    newToday: 187,
    newThisWeek: 942,
    newThisMonth: 2856,
    growthMoM: 14.7, // phần trăm tăng trưởng so với tháng trước
  
    dailyRegistrations: [
      { date: "2026-02-11", count: 112 },
      { date: "2026-02-12", count: 98 },
      { date: "2026-02-13", count: 145 },
      { date: "2026-02-14", count: 210 },
      { date: "2026-02-15", count: 178 },
      { date: "2026-02-16", count: 203 },
      { date: "2026-02-17", count: 156 },
      // ... bạn có thể copy thêm để đủ 30 ngày nếu muốn
    ],
  
    monthlyRegistrations: [
      { month: "2025-09", count: 1840 },
      { month: "2025-10", count: 2100 },
      { month: "2025-11", count: 2450 },
      { month: "2025-12", count: 2680 },
      { month: "2026-01", count: 2950 },
      { month: "2026-02", count: 2856 },
    ],
  
    roleDistribution: [
      { name: "User", value: 11820 },
      { name: "Admin", value: 320 },
      { name: "Moderator", value: 340 },
    ],
  };