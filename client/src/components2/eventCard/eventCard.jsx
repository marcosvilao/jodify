import React, { useState, useEffect } from "react";
import styles from "./eventCard.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

function EventCard(props) {
  return (
    <div className={styles.body} onClick={props.OnClick}>
      <div className={styles.containerImg}>
        <img src={props.Img} alt="Error al cargar la imagen" />
      </div>

      <div className={styles.containerData}>
        <h3>{props.Tittle}</h3>

        <div className={styles.containerP}>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              height: "35px",
            }}
          >
            <LocationOnIcon
              className={styles.icon}
              style={{ height: "20px", width: "20px" }}
            />
            <p>{props.Location}</p>
          </div>
          <div style={{ display: "flex" }}>
            <MusicNoteIcon
              className={styles.icon}
              style={{ height: "20px", width: "20px" }}
            />
            <p>{props.Genre}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
