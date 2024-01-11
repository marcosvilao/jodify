import React from "react";
import styles from "./buttonBlue.module.css";

function ButtonBlue(props) {
  return (
    <button className={styles.buttonBlue} onClick={props.OnClick}>
      {props.Value}
    </button>
  );
}

export default ButtonBlue;
