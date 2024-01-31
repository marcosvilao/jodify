import React from "react";
import styles from "./eventCard.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

function shortenStringForMobile(string) {
  let screenWidth = window.innerWidth;
  var maxLength = 90;

  if (screenWidth > 550 && screenWidth <= 700) {
    maxLength = 80;
  } else if (screenWidth > 450 && screenWidth <= 550) {
    maxLength = 60;
  } else if (screenWidth <= 450 && screenWidth > 400) {
    maxLength = 42;
  } else if (screenWidth <= 400 && screenWidth > 350) {
    maxLength = 38;
  } else if (screenWidth <= 350) {
    maxLength = 32;
  }

  if (string.length >= maxLength) {
    return string.substring(0, maxLength) + "...";
  }

  return string;
}

function EventCard(props) {
  let stringDjs = "";
  if (props.Tittle && props.Tittle.length) {
    stringDjs = props.Tittle.map((objeto) => objeto).join(" | ");
  }

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
          <h3 className={styles.Tittle}>{secondTitle}</h3>
        ) : (
          <div>
            {stringDjs ? (
              <h3 className={styles.Tittle}>{stringDjs}</h3>
            ) : (
              <h3 className={styles.TittleTwo} style={{ opacity: "0.4" }}>
                Nombre del evento
              </h3>
            )}
          </div>
        )}

        <div className={styles.containerP}>
          <div>
            <LocationOnIcon
              className={styles.icon}
              style={{
                height: "20px",
                width: "20px",
                color: props.Color ? props.Color : "#7c16f5",
              }}
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
              style={{
                height: "20px",
                width: "20px",
                color: props.Color ? props.Color : "#7c16f5",
              }}
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
