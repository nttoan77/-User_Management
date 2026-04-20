// src/components/AlertBox/AlertBox.jsx
import React from "react";
import classNames from "classnames/bind";
import styles from "./AlertBox.module.scss";

const cx = classNames.bind(styles);

const AlertBox = ({ alert }) => {
  if (!alert.show) return null;

  return (
    <div
      className={cx("alert", {
        success: alert.type === "success",
        error: alert.type === "error",
        warning: alert.type === "warning",
      })}
    >
      {alert.message}
    </div>
  );
};

export default AlertBox;
