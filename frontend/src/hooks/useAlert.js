// src/hooks/useAlert.js
import { useState, useEffect } from "react";

export default function useAlert(timeout = 3000) {
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, type: "", message: "" });
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [alert, timeout]);

  return { alert, showAlert };
}
