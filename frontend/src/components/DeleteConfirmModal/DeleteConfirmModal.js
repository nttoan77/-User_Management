// src/components/DeleteConfirmModal.jsx
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

/**
 * Hiển thị popup xác nhận (xóa mềm / xóa vĩnh viễn)
 */
export const showDeleteConfirm = async ({
  title = "Xác nhận xóa CV?" ,
  text = "CV sẽ được chuyển vào thùng rác.",
  confirmButtonText = "Có, xóa!",
  cancelButtonText = "Hủy",
  icon = "warning",

  successTitle = "Thành công!",
  successText = "CV đã được xử lý thành công.",

  onConfirm,
  onCancel = () => {},
}) => {
  const result = await MySwal.fire({
    title,
    html: text,
    icon,

    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,

    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",

    reverseButtons: true,
    focusCancel: true,

    backdrop: true,
    allowOutsideClick: false,
    allowEscapeKey: false,

    customClass: {
      popup: "delete-confirm-popup",
      confirmButton: "swal2-confirm-btn",
      cancelButton: "swal2-cancel-btn",
    },
  });

  // ❗ SỬA: xử lý async + try/catch
  if (result.isConfirmed) {
    try {
      await onConfirm(); // ✅ CHỜ API XONG

      await MySwal.fire({
        title: successTitle, // ✅ SỬA: custom được
        text: successText,
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete error:", error);

      await MySwal.fire({
        title: "Lỗi!",
        text: "Có lỗi xảy ra, vui lòng thử lại.",
        icon: "error",
      });
    }
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    onCancel();
  }
};

export default showDeleteConfirm;
