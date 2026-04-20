import classNames from "classnames/bind";
import style from "./Introduce.module.scss";
import useInView from "~/components/hooks/useInView";

const cx = classNames.bind(style);

function Introduce({ data }) {
  const [ref, inView] = useInView(0.3);

  if (!data)
    return (
      <div className={cx("loading")}>
        Đang tải dữ liệu CV của bạn...
      </div>
    );

  return (
    <div ref={ref} className={cx("wrapper", { animate: inView })}>

      {/* Avatar */}
      <div className={cx("avatar")}>
        <img
          className={cx("avatar-img")}
          src={data.avatar || "/default-avatar.png"}
          alt="Avatar"
        />
      </div>

      {/* Content */}
      <div className={cx("content")}>
        <div className={cx("content-wrapper")}>

          <div className={cx("item")}>
            <span className={cx("label")}>Họ tên:</span>
            <span className={cx("value")}>{data.fullName || "Chưa có dữ liệu"}</span>
          </div>

          <div className={cx("item")}>
            <span className={cx("label")}>Vị trí:</span>
            <span className={cx("value")}>{data.position || "Chưa có dữ liệu"}</span>
          </div>

          <div className={cx("item")}>
            <span className={cx("label")}>Email:</span>
            <span className={cx("value")}>{data.email || "Chưa có dữ liệu"}</span>
          </div>

          <div className={cx("item")}>
            <span className={cx("label")}>Số điện thoại:</span>
            <span className={cx("value")}>{data.phone || "Chưa có dữ liệu"}</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Introduce;
