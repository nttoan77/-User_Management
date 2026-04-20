import classNames from 'classnames/bind';
import style from './editInformation.module.scss';

const cx = classNames.bind(style);

const registerInform = [
    { item: 'Thông tin cá nhân' },
    { item: 'Mong muốn' },
    { item: 'Kinh nghiệm và dự án' },
    { item: 'Bằng cấp chứng chỉ' },
    { item: 'Kỉ năng mềm' },
];

function RegisterInform() {
    return (
        <div className={cx('register-inform')}>
            <div className={cx('wrapper')}>
                <div className={cx('header')}>Các thông tin cần chỉnh sữa</div>
                <div className={cx('mean')}>
                    {registerInform.map((ite, idx) => {
                        return (
                            <div className={cx('item-item')} key={idx}>
                                <div className={cx('item-content')}>{ite.item}</div>
                                <div className={cx('item-input')}>
                                    <input className={cx('item-input-i')} placeholder={ite.item} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default RegisterInform;
