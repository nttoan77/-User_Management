import { useState, useEffect, useRef } from "react";
import styles from "./search.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SearchCV = ({ onSearch, loading = false }) => {
  const [keyword, setKeyword] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(keyword.trim());
    }, 500);

    return () => clearTimeout(delay);
  }, [keyword, onSearch]);

  const handleClear = () => {
    setKeyword("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(keyword.trim());
    }
  };

  return (
    <div className={cx("search")}>
      <div
        className={cx("searchBox", {
          focused,
          loading,
        })}
      >
        <span className={cx("icon")}>🔍</span>

        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm CV theo tên..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cx("input")}
        />

        {loading && <span className={cx("spinner")} />}

        {keyword && !loading && (
          <button
            className={cx("clearBtn")}
            onClick={handleClear}
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchCV;