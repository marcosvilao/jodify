import React, { useState } from "react";
import styles from "./inputSearch.module.css";
import SearchIcon from "@mui/icons-material/Search";

function InputSearch(props) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`${styles.body} ${isFocused ? styles.bodyFocused : ""}`}>
      <SearchIcon className={styles.icon} />
      <input
        className={styles.inputSearch}
        placeholder={props.PlaceHolder}
        onChange={props.OnChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
}

export default InputSearch;
