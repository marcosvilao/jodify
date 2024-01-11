import React from "react";
import styles from "./selectBlack.module.css";

function SelectBlack(props) {
  return (
    <select className={styles.selectBlack} onChange={props.OnChange}>
      <option>{props.Option}</option>
      {props.Array &&
        props.Array.map((i) => {
          return <option>{i.value}</option>;
        })}
    </select>
  );
}

export default SelectBlack;
