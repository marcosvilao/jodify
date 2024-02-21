import React from "react";
import styles from "./parrafo.module.css";

function Parrafo(props) {
  return (
    <p
      className={styles.parrafo}
      onClick={props.OnClick}
      style={{ margin: props.Margin }}
    >
      {props.Value}
    </p>
  );
}

export default Parrafo;
