import React from "react";
import styles from "./inputSearch.module.css";
import SearchIcon from "@mui/icons-material/Search";

function InputSearch(props) {
  return (
    <div className={styles.body}>
      <SearchIcon className={styles.icon} />
      <input
        className={styles.inputSearch}
        placeholder={props.PlaceHolder}
        onChange={props.OnChange}
      />
    </div>
  );
}

export default InputSearch;
