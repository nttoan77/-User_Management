// import { useState, useEffect } from "react";
// import classNames from "classnames/bind";
// import style from "./regisCertificates.module.scss";

// const cx = classNames.bind(style);

// function AddCertificates({ value = [], onChange }) {
//   // state chứa file + preview
//   const [certificates, setCertificates] = useState(
//     value.map((file) => ({
//       file,
//       preview: typeof file === "string" ? file : URL.createObjectURL(file),
//     }))
//   );

//   // Đồng bộ khi value từ cha thay đổi
//   useEffect(() => {
//     if (value && value.length > 0) {
//       const synced = value.map((file) => ({
//         file,
//         preview: typeof file === "string" ? file : URL.createObjectURL(file),
//       }));
//       setCertificates(synced);
//     }
//   }, [value]);

//   // Khi chọn nhiều file ảnh cùng lúc
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newCertificates = [
//       ...certificates,
//       ...files.map((file) => ({
//         file,
//         preview: URL.createObjectURL(file),
//       })),
//     ];
//     setCertificates(newCertificates);
//     onChange && onChange(newCertificates);
//     // onChange && onChange(newCertificates.map((c) => c.file)); // gửi danh sách file về parent
//   };

//   // Xóa 1 ảnh
//   const handleRemove = (index) => {
//     const newCertificates = certificates.filter((_, i) => i !== index);
//     setCertificates(newCertificates);
//     onChange && onChange(newCertificates);
//     // onChange && onChange(newCertificates.map((c) => c.file));
//   };

//   return (
//     <div className={cx("form-container")}>
//       <h3>Chứng chỉ</h3>

//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={handleFileChange}
//         className={cx("file-input")}
//       />

//       <div className={cx("preview-list")}>
//         {certificates.map((cert, index) => (
//           <div key={index} className={cx("preview-item")}>
//             <img src={cert.preview} alt={`certificate-${index}`} />
//             <p className={cx("preview-name")}>
//               {cert.file?.name || `certificate-${index}`}
//             </p>
//             <button
//               type="button"
//               className={cx("btn-remove")}
//               onClick={() => handleRemove(index)}
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default AddCertificates;



import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import style from "./regisCertificates.module.scss";

const cx = classNames.bind(style);

function AddCertificates({ value = [], onChange }) {
  const fileInputRef = useRef(null); // 🔧 FIX: reset input file

  const [certificates, setCertificates] = useState([]);

  // 🔧 FIX: sync từ parent + tạo preview an toàn
  useEffect(() => {
    if (Array.isArray(value)) {
      const synced = value.map((cert) => ({
        ...cert,
        preview:
          cert.preview ||
          (cert.file instanceof File
            ? URL.createObjectURL(cert.file)
            : cert.file),
      }));
      setCertificates(synced);
    }
  }, [value]);

  // 🔧 FIX: cleanup toàn bộ preview khi component unmount
  useEffect(() => {
    return () => {
      certificates.forEach((cert) => {
        if (cert.preview && cert.preview.startsWith("blob:")) {
          URL.revokeObjectURL(cert.preview);
        }
      });
    };
  }, [certificates]);

  // 🔥 FIX CHÍNH: thêm file
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newCertificates = [
      ...certificates,
      ...files.map((file) => ({
        name: "",
        organization: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        credentialUrl: "",
        file,
        preview: URL.createObjectURL(file),
      })),
    ];

    setCertificates(newCertificates);
    onChange && onChange(newCertificates);

    // 🔧 FIX: reset input để chọn lại cùng file
    e.target.value = "";
  };

  // 🔥 FIX QUAN TRỌNG: xoá file ĐÚNG CÁCH
  const handleRemove = (index) => {
    const certToRemove = certificates[index];

    // 🔧 FIX: huỷ objectURL
    if (certToRemove?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(certToRemove.preview);
    }

    const newCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(newCertificates);
    onChange && onChange(newCertificates);
  };

  return (
    <div className={cx("form-container")}>
      <h3>Chứng chỉ</h3>

      <input
        ref={fileInputRef} // 🔧 FIX
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={handleFileChange}
        className={cx("file-input")}
      />

      <div className={cx("preview-list")}>
        {certificates.map((cert, index) => (
          <div key={index} className={cx("preview-item")}>
            {cert.preview && (
              <img src={cert.preview} alt={`certificate-${index}`} />
            )}

            <p className={cx("preview-name")}>
              {cert.file?.name || `certificate-${index}`}
            </p>

            <button
              type="button"
              className={cx("btn-remove")}
              onClick={() => handleRemove(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddCertificates;

