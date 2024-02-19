import React from "react";
import styles from "./footer.module.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  const onClickFacebook = () => {
    window.open("https://web.facebook.com/jodifyapp", "_blank");
  };

  const onClickInstagram = () => {
    window.open("https://www.instagram.com/jodify_app/", "_blank");
  };

  const onClickTerminosYCondiciones = () => {
    window.open(
      "https://docs.google.com/document/d/1TfEUUwhTjadxgyJ8QM5tBsgNALGox2YhFgTXndlk-A0/edit?pli=1",
      "_blank"
    );
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.containerLeft}>
          <p>©</p>
          <p>Jodify</p>
          <FacebookIcon className={styles.icons} onClick={onClickFacebook} />
          <InstagramIcon className={styles.icons} onClick={onClickInstagram} />
        </div>

        <p className={styles.terminos} onClick={onClickTerminosYCondiciones}>
          Terminos y Condiciones
        </p>
      </div>
    </div>
  );
}

export default Footer;
