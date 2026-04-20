import classNames from 'classnames/bind';
import style from './regisInformationCV.module.scss';
import { useState } from 'react'; // ✅ FIX: bỏ useEffect vì không dùng
import httpRequest from '~/utils/httpRequest';
import RegisSkills from './regisSkillForm/regisSkillForm';
import RegisWorkExperience from './regisWorkExperience/regisWorkExperience';
import RegisEducation from './regisEducation/regisEducation';
import RegisCertificates from './regisCertificates/regisCertificates';
import ToggleButton from '~/components/toggleShow/toggleShow';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(style);

const regisAddInformation = {
    nameCV: 'Tên CV mà bạn muốn tạo',
    nameUser: 'Họ và tên (chính chủ): ',
    workPosition: 'Vị trí làm việc: ',
    birdDay: 'Ngày tháng năm sinh:',
    gender: 'Giới tính: ',
    website: 'Wed cá nhận: ',
    address: 'Địa chỉ nơi ở: ',
    desireInWork: 'Mong muốn đối với ',
    careerGoals: 'Mục tiêu công việc: ',
};

function AddInformation() {
    const navigate = useNavigate();

    // toggle
    const [showWorkExperience, setShowWorkExperience] = useState(false);
    const [showAddEducation, setShowAddEducation] = useState(false);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [showCertificates, setShowCertificates] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    // personal info
    const [nameUser, setNameUser] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [careerField, setCareerField] = useState('');
    const [about, setAbout] = useState('');

    const [alertMessage, setAlertMessage] = useState('');
    const [workPosition, setWorkPosition] = useState('');
    const [website, setWebsite] = useState('');
    const [nameCV, setNameCV] = useState('');
    const [error, setError] = useState('');
    const [careerGoal, setCareerGoal] = useState('');

    // level info
    const [addWorkExperience, setAddWorkExperience] = useState([]);
    const [addSkillFrom, setAddSkillFrom] = useState([]);
    const [addEducation, setAddEducation] = useState([]);
    const [addCertificates, setAddCertificates] = useState([]);

    // handlers
    const handleAddWorkExperience = (exp) => setAddWorkExperience(exp);
    const handleAddEducation = (exp) => setAddEducation(exp);
    const handleAddSkillFrom = (exp) => setAddSkillFrom(exp);
    const handleAddCertificates = (exp) => setAddCertificates(exp);

    // =========================
    // SUBMIT
    // =========================
    const handleRegister = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Bạn chưa đăng nhập!');
            return;
        }

        // ✅ FIX: validate nhẹ frontend (không phá UI)
        if (!nameCV.trim()) {
            setError('Vui lòng nhập tên CV');
            return;
        }
        if (!workPosition.trim()) {
            setError('Vui lòng nhập vị trí công việc');
            return;
        }

        try {
            const formData = new FormData();

            const cvTitle = nameCV
                ? `CV ${nameCV} - ${new Date().getFullYear()}`
                : `CV của tôi - ${new Date().toLocaleDateString('vi-VN')}`;

            // === TEXT FIELD ===
            formData.append('title', cvTitle);
            formData.append('jobPosition', workPosition || '');

            // ✅ FIX: gửi đầy đủ personal info (trước đây BỊ THIẾU)
            formData.append('nameCV', nameCV || '');
            formData.append('nameUser', nameUser || '');
            formData.append('birthDay', birthDay || '');
            formData.append('gender', gender || '');
            formData.append('address', address || '');

            formData.append('careerField', careerField || '');
            formData.append('careerGoal', careerGoal || '');
            formData.append('about', about || '');
            formData.append('website', website || '');

            // === ARRAY JSON ===
            if (addWorkExperience.length > 0) {
                formData.append('workExperiences', JSON.stringify(addWorkExperience));
            }

            if (addEducation.length > 0) {
                formData.append('education', JSON.stringify(addEducation));
            }

            if (addSkillFrom.length > 0) {
                formData.append('skills', JSON.stringify(addSkillFrom));
            }

            // === CERTIFICATES ===
            if (addCertificates.length > 0) {
                const certPayload = [];

                addCertificates.forEach((cert) => {
                    certPayload.push({
                        name: cert.name || '',
                        organization: cert.organization || '',
                        issueDate: cert.issueDate || '',
                        expiryDate: cert.expiryDate || '',
                        credentialId: cert.credentialId || '',
                        credentialUrl: cert.credentialUrl || '',
                    });

                    if (cert.file instanceof File) {
                        formData.append('certificateFiles', cert.file);
                    }
                });

                formData.append('certificates', JSON.stringify(certPayload));
            }

            // === CALL API ===
            await httpRequest.post('/api/cv/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAlertMessage('Tạo CV thành công!');
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                navigate('/choose-cv');
            }, 3000);
        } catch (error) {
            const msg = error.response?.data?.message || 'Tạo CV thất bại!';
            setError(msg);
        }
    };

    const handleCancel = () => {
        setNameUser('');
        setGender('');
        setBirthDay('');
        setAddress('');
        setCareerField('');
        setAbout('');
        setWebsite('');
        setNameCV('');
        setCareerGoal('');
        setWorkPosition('');
        setAddWorkExperience([]);
        setAddSkillFrom([]);
        setAddEducation([]);
        setAddCertificates([]);

        localStorage.removeItem('regisInfo');
        navigate('/choose-cv');
    };

    return (
        <div className={cx('add-information')}>
            {showAlert && <div className={cx('custom-alert')}>{alertMessage}</div>}

            <form className={cx('wrapper')}>
                <div className={cx('header')}>Tạo thông tin CV</div>

                <div className={cx('main')}>
                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.nameCV}</div>
                        <input
                            placeholder='vd: Quảng Trị Doanh Nghiệp'
                            className={cx('m-item-input')}
                            value={nameCV}
                            onChange={(e) => setNameCV(e.target.value)}
                        />
                    </div>

                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.website}</div>
                        <input
                            placeholder='vd: số zalo , facebook , ...'

                            className={cx('m-item-input')}
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>

                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.workPosition}</div>
                        <input
                            placeholder='vd: Nhân viện,... '
                            className={cx('m-item-input')}
                            value={workPosition}
                            onChange={(e) => setWorkPosition(e.target.value)}
                        />
                    </div>

                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.careerGoals}</div>
                        <textarea
                            placeholder='Những điều mà bạn muốn, cần trong lĩnh vực và công việc này .....'

                            className={cx('m-item-input', 'm-item-textarea')}
                            value={careerGoal}
                            onChange={(e) => setCareerGoal(e.target.value)}
                        />
                    </div>

                    <div className={cx('level-information')}>
                        <ToggleButton
                            show={showWorkExperience}
                            onToggle={setShowWorkExperience}
                            labelShow="+ Kinh nghiệm làm việc"
                            labelHide="ẩn"
                        />
                        {showWorkExperience && (
                            <RegisWorkExperience value={addWorkExperience} onChange={handleAddWorkExperience} />
                        )}

                        <ToggleButton
                            show={showSkillForm}
                            onToggle={setShowSkillForm}
                            labelShow="+ Kỹ năng công việc"
                            labelHide="ẩn"
                        />
                        {showSkillForm && <RegisSkills value={addSkillFrom} onChange={handleAddSkillFrom} />}

                        <ToggleButton
                            show={showAddEducation}
                            onToggle={setShowAddEducation}
                            labelShow="+ Trình độ học vấn"
                            labelHide="ẩn"
                        />
                        {showAddEducation && (
                            <RegisEducation value={addEducation} onChange={handleAddEducation} />
                        )}

                        <ToggleButton
                            show={showCertificates}
                            onToggle={setShowCertificates}
                            labelShow="+ Các chứng chỉ liên quan"
                            labelHide="ẩn"
                        />
                        {showCertificates && (
                            <RegisCertificates value={addCertificates} onChange={handleAddCertificates} />
                        )}
                    </div>
                </div>

                {/* {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>} */}

                <div className={cx('footer')}>
                    <button className={cx('btn-cancel')} onClick={(e) => { e.preventDefault(); handleCancel(); }}>
                        Huỷ
                    </button>
                    <button className={cx('btn-register')} onClick={(e) => { e.preventDefault(); handleRegister(); }}>
                        Đăng ký
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddInformation;
