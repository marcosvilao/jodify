import React from "react";
import styles from "./buttonPicker.module.css";

function ButtonPicker(props) {
  return (
    <button className={styles.buttonPicker} onClick={props.OnClick}>
      {props.Value}
    </button>
  );
}

export default ButtonPicker;
