import React from "react";
import styles from "./buttonPickerSelected.module.css";
import CloseIcon from "@mui/icons-material/Close";

function ButtonPickerSelected(props) {
  return (
    <div className={styles.body}>
      <button className={styles.buttonPickerSelected} onClick={props.OnClick}>
        {props.Value}
      </button>
      <CloseIcon className={styles.icon} onClick={props.OnClickIcon} />
    </div>
  );
}

export default ButtonPickerSelected;
