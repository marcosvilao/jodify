import React from "react";
import styles from "./tittleH1.module.css";

function TittleH1(props) {
  return <h1 className={styles.tittleH1}>{props.Value}</h1>;
}

export default TittleH1;
