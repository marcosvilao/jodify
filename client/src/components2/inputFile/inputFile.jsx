import React from "react";
import styles from "./inputFile.module.css";

function InputFile(props) {
  return (
    <div className={styles.inputFileContainer}>
      <label>Seleciona una imagen:</label>
      <input Type="file" onChange={(e) => props.OnClick(e)} />
      {props.File === "" ? (
        <p>Ningun archivo selec...</p>
      ) : (
        <p>Archivo seleccionado</p>
      )}
    </div>
  );
}

export default InputFile;
