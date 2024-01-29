import React from "react";
import styles from "./inputFile.module.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";

function InputFile(props) {
  return (
    <div
      className={styles.bodyInputFile}
      style={{ margin: props.Margin ? props.Margin : "10px 0px" }}
    >
      <label style={{ color: props.Error ? "#FF5353" : "#FFFFFF" }}>
        Imagen:
      </label>

      <div
        className={styles.inputFileContainer}
        style={{
          border: props.Error ? "2px dashed #FF5353" : "2px dashed #ffffff",
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
          <p style={{ color: "#FFFFFF" }}>
            Has seleccionado el archivo correctamente
          </p>
        )}
      </div>
      {props.Error ? <p style={{ color: "#FF5353" }}>{props.Error}</p> : null}
    </div>
  );
}

export default InputFile;
