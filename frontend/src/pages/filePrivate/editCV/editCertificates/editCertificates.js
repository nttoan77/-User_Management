import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import style from './editCertificates.module.scss';

const cx = classNames.bind(style);

function EditCertificates({ value = [], onChange }) {
    const fileInputRef = useRef(null);
    const prevValueRef = useRef([]);

    const [certificates, setCertificates] = useState([]);

    // ====================== SYNC DỮ LIỆU TỪ CHA + TRÁNH LOOP ======================
    useEffect(() => {
        const currentClean = value.map((c) => ({ ...c, preview: undefined }));
        const prevClean = prevValueRef.current.map((c) => ({ ...c, preview: undefined }));

        if (JSON.stringify(currentClean) === JSON.stringify(prevClean)) {
            // console.log('[EditCertificates] Dữ liệu không thay đổi → bỏ qua sync');
            return;
        }

        // console.log('[EditCertificates] Sync từ cha - Số lượng:', value.length);

        const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:8888';

        const synced = value.map((cert, idx) => {
            let preview = cert.preview || '';

            if (cert.file instanceof File) {
                preview = URL.createObjectURL(cert.file);
                // console.log(`[Preview NEW FILE] Cert ${idx} → blob URL`);
            } else if (cert.file?.path) {
                // ★★★ ĐÃ CHỮA: Path giờ là /uploads/cv/... → chỉ cần ghép trực tiếp ★★★
                let cleanPath = cert.file.path;

                // Loại bỏ dấu / đầu nếu có (tránh double slash)
                if (cleanPath.startsWith('/')) {
                    cleanPath = cleanPath.substring(1);
                }

                preview = `${apiBase}/${cleanPath}`;
                // console.log(`[Preview OLD FILE] Cert ${idx} → ${preview}`);
            } else {
                // console.log(`[Preview] Cert ${idx} → không có file/path`);
            }

            return {
                ...cert,
                preview,
                name: cert.name || '',
                organization: cert.organization || '',
                issueDate: cert.issueDate || '',
                expiryDate: cert.expiryDate || '',
                credentialId: cert.credentialId || '',
                credentialUrl: cert.credentialUrl || '',
            };
        });

        setCertificates(synced);
        prevValueRef.current = value;
    }, [value]);

    // Cleanup blob URLs
    useEffect(() => {
        return () => {
            certificates.forEach((cert) => {
                if (cert.preview?.startsWith('blob:')) {
                    URL.revokeObjectURL(cert.preview);
                }
            });
        };
    }, [certificates]);

    // Thêm file mới
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newCerts = files.map((file) => ({
            name: file.name.split('.')[0] || 'Chứng chỉ mới',
            organization: '',
            issueDate: '',
            expiryDate: '',
            credentialId: '',
            credentialUrl: '',
            file,
            preview: URL.createObjectURL(file),
        }));

        const updated = [...certificates, ...newCerts];
        setCertificates(updated);
        onChange(updated);

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Xóa chứng chỉ
    const handleRemove = (index) => {
        const cert = certificates[index];
        if (cert?.preview?.startsWith('blob:')) {
            URL.revokeObjectURL(cert.preview);
        }

        const updated = certificates.filter((_, i) => i !== index);
        setCertificates(updated);
        onChange(updated);
    };

    // Sửa thông tin
    const handleChangeField = (index, field, val) => {
        const updated = [...certificates];
        updated[index] = { ...updated[index], [field]: val };
        setCertificates(updated);
        onChange(updated);
    };

    return (
        <div className={cx('form-container')}>
            <h3>Các chứng chỉ liên quan</h3>

            <div className={cx('upload-section')}>
                <label htmlFor="certificate-upload" className={cx('upload-label')}>
                    + Thêm chứng chỉ (ảnh/PDF)
                </label>
                <input
                    id="certificate-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className={cx('file-input')}
                />
            </div>

            <div className={cx('preview-list')}>
                {certificates.length === 0 ? (
                    <p className={cx('no-data')}>Chưa có chứng chỉ nào</p>
                ) : (
                    certificates.map((cert, index) => (
                        <div key={index} className={cx('preview-item')}>
                            {/* Preview */}
                            {cert.preview ? (
                                cert.preview.endsWith('.pdf') || cert.file?.mimetype?.includes('pdf') ? (
                                    <div className={cx('pdf-placeholder')}>
                                        <span>📄 PDF</span>
                                        <a href={cert.preview} target="_blank" rel="noopener noreferrer">
                                            Xem chứng chỉ
                                        </a>
                                    </div>
                                ) : (
                                    <img
                                        src={cert.preview}
                                        alt={`certificate-${index}`}
                                        onError={(e) => {
                                            // console.log(`[IMG ERROR] Cert ${index}: ${cert.preview}`);
                                            e.target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                )
                            ) : (
                                <div className={cx('no-preview')}>Không có preview</div>
                            )}

                            {/* Form chỉnh sửa */}
                            <div className={cx('cert-info')}>
                                <input
                                    type="text"
                                    placeholder="Tên chứng chỉ"
                                    value={cert.name}
                                    onChange={(e) => handleChangeField(index, 'name', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Tổ chức cấp"
                                    value={cert.organization}
                                    onChange={(e) => handleChangeField(index, 'organization', e.target.value)}
                                />
                                <input
                                    type="date"
                                    value={cert.issueDate}
                                    onChange={(e) => handleChangeField(index, 'issueDate', e.target.value)}
                                />
                                <input
                                    type="date"
                                    value={cert.expiryDate}
                                    onChange={(e) => handleChangeField(index, 'expiryDate', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Credential ID"
                                    value={cert.credentialId}
                                    onChange={(e) => handleChangeField(index, 'credentialId', e.target.value)}
                                />
                                <input
                                    type="url"
                                    placeholder="Link chứng chỉ"
                                    value={cert.credentialUrl}
                                    onChange={(e) => handleChangeField(index, 'credentialUrl', e.target.value)}
                                />
                            </div>

                            <button type="button" className={cx('btn-remove')} onClick={() => handleRemove(index)}>
                                ✕ Xóa
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default EditCertificates;
