// src/hooks/useClickOutside.js
import { useEffect } from 'react';

export default function useClickOutside(refs = [], callback) {
    useEffect(() => {
        if (typeof callback !== 'function') return;

        const handleClickOutside = (event) => {
            // Nếu click vào bất kỳ ref nào trong danh sách → KHÔNG đóng
            const clickedInside = refs.some((ref) => {
                return ref?.current && ref.current.contains(event.target);
            });

            // Nếu click hoàn toàn ra ngoài tất cả refs → gọi callback
            if (!clickedInside) {
                callback(event);
            }
        };

        // Sử dụng mousedown + touchstart để hỗ trợ tốt trên cả desktop và mobile
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [refs, callback]); // ← Phụ thuộc vào refs và callback
}
