import React from "react";
import styles from "./inputBlack.module.css";

function InputBlack(props) {
  return (
    <input
      className={styles.inputBlack}
      placeholder={props.Placeholder}
      name={props.Name}
      value={props.Value}
      onChange={props.OnChange}
      type={props.Type}
    />
  );
}

export default InputBlack;
