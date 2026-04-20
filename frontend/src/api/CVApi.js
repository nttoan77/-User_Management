// src/api/cvApi.js
const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/cv`;

// ✅ Hàm helper gọi API
async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
}

// 🧾 Lấy danh sách CV của user
export async function getAllCVByUser(userId, token) {
  return request(`${BASE_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 🆕 Tạo CV mới
export async function createCV(formData, token) {
  return request(`${BASE_URL}/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
}

// 🔍 Lấy chi tiết CV
export async function getCVById(id, token) {
  return request(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ✏️ Cập nhật CV
export async function updateCV(id, formData, token) {
  return request(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
}

// ❌ Xóa CV
export async function deleteCV(id, token) {
  return request(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
