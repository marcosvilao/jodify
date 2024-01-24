import React from "react";
import styles from "./inputFile.module.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";

function InputFile(props) {
  return (
    <div
      className={styles.bodyInputFile}
      style={{ margin: props.Margin ? props.Margin : "10px 0px" }}
    >
      <label>Imagen:</label>

      <div className={styles.inputFileContainer}>
        <label for="seleccionar-archivo">
          <FileUploadIcon />
          <span>Seleccionar Archivo</span>
        </label>
        <input
          id="seleccionar-archivo"
          Type="file"
          onChange={(e) => props.OnClick(e)}
        />

        {props.File === "" ? (
          <p>Ningun archivo seleccionado</p>
        ) : (
          <p>Has seleccionado el archivo correctamente</p>
        )}
      </div>
    </div>
  );
}

export default InputFile;
