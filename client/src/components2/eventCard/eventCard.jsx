import React, { useEffect, useState } from "react";
import styles from "./eventCard.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

function EventCard(props) {
  let stringDjs = "";
  if (props.Tittle && props.Tittle.length) {
    stringDjs = props.Tittle.map((objeto) => objeto).join(" | ");
  }
  const genreNames = props.Genre?.map((genre) => genre.name).join(" | ");

  const [backgroundImage, setBackgroundImage] = useState(
    `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtUrkpYuR15MZHeLQ_dTpNnG-1_uJFE4kE4FHkhAqaKw&s")`
  );

  useEffect(() => {
    const img = new Image();
    img.src = props.Img;
    img.onload = () => setBackgroundImage(`url("${props.Img}")`);
    img.onerror = () =>
      setBackgroundImage(
        `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtUrkpYuR15MZHeLQ_dTpNnG-1_uJFE4kE4FHkhAqaKw&s")`
      );
  }, [props.Img]);

  return (
    <a
      className={styles.body}
      onClick={props.OnClick}
      id={props.ID}
      style={{ cursor: props.Link ? "default" : "pointer" }}
    >
      {props.EventImg ? (
        <div className={styles.dontImgContainer}>
          <p style={{ fontSize: "16px", margin: "0px" }}>Img</p>
        </div>
      ) : (
        <div
          className={styles.containerImg}
          style={{
            backgroundImage: backgroundImage,
          }}
        ></div>
      )}

      <div className={styles.containerData}>
        {props.SecondTittle ? (
          <h3 className={styles.Tittle}>{props.SecondTittle}</h3>
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

        <div className={styles.containerPOne}>
          <LocationOnIcon
            className={styles.icon}
            style={{
              height: "18px",
              width: "18px",
              color: props.Color ? props.Color : "#c18fff",
            }}
          />
          {props.Location ? (
            <p>{props.Location}</p>
          ) : (
            <p style={{ opacity: "0.4" }}>Ubicación</p>
          )}
        </div>

        <div className={styles.containerPTwo}>
          <MusicNoteIcon
            className={styles.icon}
            style={{
              height: "18px",
              width: "18px",
              color: props.Color ? props.Color : "#c18fff",
            }}
          />
          {genreNames ? (
            <p>{genreNames}</p>
          ) : (
            <p style={{ opacity: "0.4" }}>Género musical</p>
          )}
        </div>
      </div>
    </a>
  );
}

export default EventCard;
