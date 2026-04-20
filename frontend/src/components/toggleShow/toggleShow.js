import classNames from "classnames/bind";
import style from "./toggleShow.module.scss";

const cx = classNames.bind(style);

function ToggleButton({ show, onToggle, labelShow, labelHide, classNames }) {
  return (
    <div className={cx("toggle-show" )}>
      <button
        type="button"
        onClick={() => onToggle(!show)}
        className={cx(show ? "btn-add-hide" : "btn-add-toggle", "btn-add", classNames)}
      >
        {show ? labelHide : labelShow}
      </button>
    </div>
  );
}

export default ToggleButton;
