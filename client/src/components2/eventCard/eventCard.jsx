import React from "react";
import styles from "./eventCard.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

function shortenStringForMobile(string) {
  const maxWidth = 450;
  const maxLength = 30;

  if (window.innerWidth <= maxWidth && string.length > maxLength) {
    return string.substring(0, maxLength) + "...";
  }

  return string;
}

function EventCard(props) {
  let stringDjs = "";
  if (props.Tittle && props.Tittle.length) {
    stringDjs = props.Tittle.map((objeto) => objeto.value).join(" | ");
  }

  // Utilizando la función para acortar los strings si es necesario
  stringDjs = shortenStringForMobile(stringDjs);
  const secondTitle = shortenStringForMobile(props.SecondTittle || "");

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
        {props.SecondTittle ? (
          <h3>{secondTitle}</h3>
        ) : (
          <div>
            {stringDjs ? (
              <h3>{stringDjs}</h3>
            ) : (
              <h3 style={{ opacity: "0.4" }}>Nombre del evento</h3>
            )}
          </div>
        )}

        <div className={styles.containerP}>
          <div>
            <LocationOnIcon
              className={styles.icon}
              style={{ height: "20px", width: "20px" }}
            />
            {props.Location ? (
              <p>{props.Location}</p>
            ) : (
              <p style={{ opacity: "0.4" }}>Ubicación</p>
            )}
          </div>
          <div style={{ display: "flex" }}>
            <MusicNoteIcon
              className={styles.icon}
              style={{ height: "20px", width: "20px" }}
            />
            {props.Genre ? (
              <p>{props.Genre}</p>
            ) : (
              <p style={{ opacity: "0.4" }}>Género musical</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
