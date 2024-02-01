import React from "react";
import styles from "./buttonPickerSelected.module.css";
import CloseIcon from "@mui/icons-material/Close";

function ButtonPickerSelected(props) {
  return (
    <div className={styles.body}>
      <button className={styles.buttonPickerSelected} onClick={props.OnClick}>
        {props.Value}
      </button>
      {props.Close ? (
        <CloseIcon
          className={styles.icon}
          onClick={props.OnClose}
          style={{ width: "20px" }}
        />
      ) : null}
    </div>
  );
}

export default ButtonPickerSelected;
