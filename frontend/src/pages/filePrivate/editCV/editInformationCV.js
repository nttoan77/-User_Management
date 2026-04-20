import classNames from 'classnames/bind';
import style from './editInformationCV.module.scss';
import { useState, useEffect } from 'react';
import httpRequest from '~/utils/httpRequest';
import EditSkills from './editSkillForm/editSkillForm';
import EditWorkExperience from './editWorkExperience/editWorkExperience';
import EditEducation from './editEducation/editEducation';
import EditCertificates from './editCertificates/editCertificates';
import ToggleButton from '~/components/toggleShow/toggleShow';
import { useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(style);

// Label chung
const regisAddInformation = {
    nameCV: 'CV mà bạn muốn chỉnh sửa',
    nameUser: 'Họ và tên (chính chủ): ',
    workPosition: 'Vị trí làm việc: ',
    birdDay: 'Ngày tháng năm sinh:',
    gender: 'Giới tính: ',
    website: 'Web cá nhân: ',
    address: 'Địa chỉ nơi ở: ',
    desireInWork: 'Mong muốn đối với ',
    careerGoals: 'Mục tiêu công việc: ',
};

function EditCVInformation() {
    const navigate = useNavigate();
    const { id: cvId } = useParams();
    const isEdit = !!cvId;

    // toggle states
    const [showWorkExperience, setShowWorkExperience] = useState(false);
    const [showAddEducation, setShowAddEducation] = useState(false);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [showCertificates, setShowCertificates] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // personal info states
    const [nameUser, setNameUser] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [careerField, setCareerField] = useState('');
    const [about, setAbout] = useState('');
    const [workPosition, setWorkPosition] = useState('');
    const [website, setWebsite] = useState('');
    const [nameCV, setNameCV] = useState('');
    const [careerGoal, setCareerGoal] = useState('');

    // array states
    const [addWorkExperience, setAddWorkExperience] = useState([]);
    const [addSkillFrom, setAddSkillFrom] = useState([]);
    const [addEducation, setAddEducation] = useState([]);
    const [addCertificates, setAddCertificates] = useState([]);

    const [alertMessage, setAlertMessage] = useState('');
    const [error, setError] = useState('');

    // Load dữ liệu cũ khi edit
    useEffect(() => {
        if (cvId) {
            const fetchCV = async () => {
                setIsLoading(true);
                setError('');
                try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('Không tìm thấy token');

                    console.log('[FETCH] Đang tải CV ID:', cvId);
                    const res = await httpRequest.get(`/api/cv/${cvId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const cv = res.data.data || {};
                    console.log('[FETCH] Nhận được certificates:', cv.certificates?.length || 0);

                    setNameCV(
                        cv.title?.startsWith('CV ')
                            ? cv.title
                                  .replace(/^CV\s+/, '')
                                  .replace(/\s*-\s*\d{4}$/, '')
                                  .trim()
                            : cv.title || '',
                    );
                    setWorkPosition(cv.jobPosition || '');
                    setNameUser(cv.nameUser || '');
                    setBirthDay(cv.birthDay || '');
                    setGender(cv.gender || '');
                    setAddress(cv.address || '');
                    setCareerField(cv.careerField || '');
                    setCareerGoal(cv.careerGoal || '');
                    setAbout(cv.about || '');
                    setWebsite(cv.website || '');

                    setAddWorkExperience(cv.workExperiences || []);
                    setAddEducation(cv.education || []);
                    setAddSkillFrom(cv.skills || []);
                    setAddCertificates(cv.certificates || []);
                } catch (err) {
                    console.error('[FETCH ERROR]', err);
                    setError('Không thể tải thông tin CV. Vui lòng thử lại!');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCV();
        }
    }, [cvId]);

    // handlers cho sub-components
    const handleAddWorkExperience = (exp) => setAddWorkExperience(exp);
    const handleAddEducation = (exp) => setAddEducation(exp);
    const handleAddSkillFrom = (exp) => setAddSkillFrom(exp);
    const handleAddCertificates = (exp) => setAddCertificates(exp);

    // Submit - đã sửa lỗi replace + xử lý file cũ
    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Bạn chưa đăng nhập!');
            return;
        }

        if (!nameCV.trim()) {
            setError('Vui lòng nhập tên CV');
            return;
        }
        if (!workPosition.trim()) {
            setError('Vui lòng nhập vị trí công việc');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();

            const cvTitle = nameCV
                ? `CV ${nameCV} - ${new Date().getFullYear()}`
                : `CV của tôi - ${new Date().toLocaleDateString('vi-VN')}`;

            // Text fields
            formData.append('title', cvTitle);
            formData.append('jobPosition', workPosition || '');
            formData.append('nameUser', nameUser || '');
            formData.append('birthDay', birthDay || '');
            formData.append('gender', gender || '');
            formData.append('address', address || '');
            formData.append('careerField', careerField || '');
            formData.append('careerGoal', careerGoal || '');
            formData.append('about', about || '');
            formData.append('website', website || '');

            // workExperiences
            addWorkExperience.forEach((exp, index) => {
                formData.append(`workExperiences[${index}][company]`, exp.company || '');
                formData.append(`workExperiences[${index}][position]`, exp.position || '');
                formData.append(`workExperiences[${index}][startDate]`, exp.startDate || '');
                formData.append(`workExperiences[${index}][endDate]`, exp.endDate || '');
                formData.append(`workExperiences[${index}][description]`, exp.description || '');
                formData.append(`workExperiences[${index}][achievements]`, exp.achievements || '');
            });

            // education
            addEducation.forEach((edu, index) => {
                formData.append(`education[${index}][school]`, edu.school || '');
                formData.append(`education[${index}][degree]`, edu.degree || '');
                formData.append(`education[${index}][fieldOfStudy]`, edu.fieldOfStudy || '');
                formData.append(`education[${index}][startDate]`, edu.startDate || '');
                formData.append(`education[${index}][endDate]`, edu.endDate || '');
                formData.append(`education[${index}][description]`, edu.description || '');

                const subjects = typeof edu.subjects === 'string' ? edu.subjects : String(edu.subjects || '');
                const achievements =
                    typeof edu.achievements === 'string' ? edu.achievements : String(edu.achievements || '');

                const cleanSubjects = subjects
                    .replace(/^["']|["']$/g, '')
                    .replace(/\\["']/g, '"')
                    .replace(/\\"/g, '"')
                    .trim();

                const cleanAchievements = achievements
                    .replace(/^["']|["']$/g, '')
                    .replace(/\\["']/g, '"')
                    .replace(/\\"/g, '"')
                    .trim();

                formData.append(`education[${index}][subjects]`, cleanSubjects);
                formData.append(`education[${index}][achievements]`, cleanAchievements);
            });

            // skills
            addSkillFrom.forEach((skill, index) => {
                formData.append(`skills[${index}][name]`, skill.name || '');
                formData.append(`skills[${index}][description]`, skill.description || '');
                formData.append(`skills[${index}][category]`, skill.category || 'hard');
                formData.append(`skills[${index}][level]`, skill.level || 'intermediate');
            });

            // certificates - ĐÃ CHỮA: đảm bảo gửi certificates dưới dạng JSON string
            if (addCertificates.length > 0) {
                // Gửi text certificates dưới dạng JSON string
                formData.append(
                    'certificates',
                    JSON.stringify(
                        addCertificates.map((cert) => ({
                            name: cert.name || '',
                            organization: cert.organization || '',
                            issueDate: cert.issueDate || '',
                            expiryDate: cert.expiryDate || '',
                            credentialId: cert.credentialId || '',
                            credentialUrl: cert.credentialUrl || '',
                            // KHÔNG gửi file ở đây (file gửi riêng qua FormData)
                        })),
                    ),
                );

                // Gửi file thật (chỉ file mới)
                addCertificates.forEach((cert, index) => {
                    if (cert.file instanceof File) {
                        formData.append('certificateFiles', cert.file);
                    } else if (cert.file?.path) {
                        // Gửi path file cũ để backend biết giữ nguyên
                        formData.append(`certificates[${index}][file][path]`, cert.file.path);
                        formData.append(`certificates[${index}][file][filename]`, cert.file.filename || '');
                        formData.append(`certificates[${index}][file][mimetype]`, cert.file.mimetype || '');
                        formData.append(`certificates[${index}][file][size]`, cert.file.size || 0);
                    }
                });
            }

            let res;
            if (cvId) {
                res = await httpRequest.put(`/api/cv/${cvId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAlertMessage('Cập nhật CV thành công!');
            } else {
                res = await httpRequest.post('/api/cv/', formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAlertMessage('Tạo CV thành công!');
            }

            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                navigate('/choose-cv');
            }, 3000);
        } catch (error) {
            const msg = error.response?.data?.message || (cvId ? 'Cập nhật thất bại!' : 'Tạo CV thất bại!');
            setError(msg);
            console.error('[SUBMIT ERROR]', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setNameUser('');
        setBirthDay('');
        setGender('');
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
        setError('');
        setShowAlert(false);

        navigate('/choose-cv');
    };

    return (
        <div className={cx('add-information')}>
            {showAlert && <div className={cx('custom-alert')}>{alertMessage}</div>}

            <form className={cx('wrapper')}>
                <div className={cx('header')}>{cvId ? 'Chỉnh sửa thông tin CV' : 'Tạo thông tin CV'}</div>

                {isLoading && <div className={cx('loading')}>Đang xử lý...</div>}

                <div className={cx('main')}>
                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.nameCV}</div>
                        <input
                            placeholder="vd: Quảng Trị Doanh Nghiệp"
                            className={cx('m-item-input')}
                            value={nameCV}
                            onChange={(e) => setNameCV(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.website}</div>
                        <input
                            placeholder="vd: số zalo , facebook , ..."
                            className={cx('m-item-input')}
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.workPosition}</div>
                        <input
                            placeholder="vd: Nhân viện,... "
                            className={cx('m-item-input')}
                            value={workPosition}
                            onChange={(e) => setWorkPosition(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={cx('m-item')}>
                        <div className={cx('m-item-content')}>{regisAddInformation.careerGoals}</div>
                        <textarea
                            placeholder="Những điều mà bạn muốn, cần trong lĩnh vực và công việc này ....."
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
                            <EditWorkExperience value={addWorkExperience} onChange={handleAddWorkExperience} />
                        )}

                        <ToggleButton
                            show={showSkillForm}
                            onToggle={setShowSkillForm}
                            labelShow="+ Kỹ năng công việc"
                            labelHide="ẩn"
                        />
                        {showSkillForm && <EditSkills value={addSkillFrom} onChange={handleAddSkillFrom} />}

                        <ToggleButton
                            show={showAddEducation}
                            onToggle={setShowAddEducation}
                            labelShow="+ Trình độ học vấn"
                            labelHide="ẩn"
                        />
                        {showAddEducation && <EditEducation value={addEducation} onChange={handleAddEducation} />}

                        <ToggleButton
                            show={showCertificates}
                            onToggle={setShowCertificates}
                            labelShow="+ Các chứng chỉ liên quan"
                            labelHide="ẩn"
                        />
                        {showCertificates && (
                            <EditCertificates value={addCertificates} onChange={handleAddCertificates} />
                        )}
                    </div>
                </div>

                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

                <div className={cx('footer')}>
                    <button
                        className={cx('btn-cancel')}
                        onClick={(e) => {
                            e.preventDefault();
                            handleCancel();
                        }}
                        disabled={isLoading}
                    >
                        Huỷ
                    </button>
                    <button
                        className={cx('btn-register')}
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : cvId ? 'Cập nhật' : 'Đăng ký'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditCVInformation;
