import React from "react";
import styles from "./inputFile.module.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DoneIcon from "@mui/icons-material/Done";

function InputFile(props) {
  return (
    <div
      className={styles.bodyInputFile}
      style={{ margin: props.Margin ? props.Margin : "10px 0px" }}
    >
      <label
        style={{
          color: props.File ? "lightgray" : props.Error ? "#FF5353" : "#FFFFFF",
        }}
      >
        Imagen:
      </label>

      <div
        className={styles.inputFileContainer}
        style={{
          border: props.File
            ? "2px dashed lightgray"
            : props.Error
            ? "2px dashed #FF5353"
            : "2px dashed #ffffff",
        }}
      >
        <label
          for="seleccionar-archivo"
          style={{ color: props.Error ? "#FF5353" : "#AE71F9" }}
        >
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
          <div className={styles.containerSeleccionado}>
            <p>Archivo seleccionado</p>
            <DoneIcon className={styles.dondeIcon} />
          </div>
        )}
      </div>
      {props.Error ? <p style={{ color: "#FF5353" }}>{props.Error}</p> : null}
    </div>
  );
}

export default InputFile;
