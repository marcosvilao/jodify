import React from "react";
import styles from "./eventCard.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

function EventCard(props) {
  return (
    <div className={styles.body} onClick={props.OnClick}>
      {!props.Img ? (
        <div className={styles.dontImgContainer}>
          <p style={{ fontSize: "16px", margin: "0px" }}>Img</p>
        </div>
      ) : (
        <div
          className={styles.containerImg}
          style={{ backgroundImage: `url("${props.Img}")` }}
        ></div>
      )}

      <div className={styles.containerData}>
        <h3>{props.Tittle}</h3>

        <div className={styles.containerP}>
          <div>
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
