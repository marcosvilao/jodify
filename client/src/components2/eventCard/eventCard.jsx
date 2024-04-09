import React, { useEffect, useState } from "react";
import styles from "./eventCard.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ShareIcon from "@mui/icons-material/Share";
import ImgDefault1 from "../../assets/img-event-card-default/img-1.jpg";
import ImgDefault2 from "../../assets/img-event-card-default/img-2.jpg";
import ImgDefault3 from "../../assets/img-event-card-default/img-3.jpg";
import ImgDefault4 from "../../assets/img-event-card-default/img-4.jpg";
import ImgDefault5 from "../../assets/img-event-card-default/img-5.jpg";
import ImgDefault6 from "../../assets/img-event-card-default/img-6.jpg";
import LoadingImg from "../../assets/loading-img.png";

function EventCard(props) {
  let stringDjs = "";
  if (props.Tittle && props.Tittle.length) {
    stringDjs = props.Tittle.map((objeto) => objeto).join(" | ");
  }
  const genreNames = props.Genre?.map((genre) => genre.name).join(" | ");

  const [backgroundImage, setBackgroundImage] = useState(
    `url("${LoadingImg}")`
  );

  useEffect(() => {
    const imgDefaults = [
      ImgDefault1,
      ImgDefault2,
      ImgDefault3,
      ImgDefault4,
      ImgDefault5,
      ImgDefault6,
    ];
    const img = new Image();
    img.src = props.Img;
    img.onload = () => setBackgroundImage(`url("${props.Img}")`);
    img.onerror = () => {
      const randomImg =
        imgDefaults[Math.floor(Math.random() * imgDefaults.length)];
      setBackgroundImage(`url("${randomImg}")`);
    };
  }, [props.Img]);

  return (
    <a
      className={styles.body}
      onClick={props.OnClick}
      id={props.ID}
      style={{ cursor: props.Link ? "default" : "pointer" }}
    >
      {!props.Img ? (
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

        <div className={styles.containerShare} onClick={props.Share}>
          <ShareIcon
            className={styles.iconShare}
            style={{
              height: "18px",
              width: "18px",
            }}
          />
        </div>
      </div>
    </a>
  );
}

export default EventCard;
