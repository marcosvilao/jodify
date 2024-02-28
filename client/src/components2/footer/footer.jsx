import React, { useState, useEffect } from "react";
import styles from "./footer.module.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  const [hideFooter, setHideFooter] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setHideFooter(true);
    } else {
      setHideFooter(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div
      className={styles.body}
      style={{
        transform: `translateY(${hideFooter ? "100%" : "0"})`,
      }}
    >
      <div
        className={styles.container}
        style={{
          transform: `translateY(${hideFooter ? "100%" : "0"})`,
        }}
      >
        <div className={styles.containerLeft}>
          <p>©</p>
          <p>Jodify</p>
          <FacebookIcon
            onClick={onClickFacebook}
            className={styles.icons}
            style={{
              width: "15px",
              height: "15px",
              cursor: "pointer",
              marginRight: "2px",
            }}
          />
          <InstagramIcon
            className={styles.icons}
            onClick={onClickInstagram}
            style={{ width: "15px", height: "15px", cursor: "pointer" }}
          />
        </div>

        <p className={styles.terminos} onClick={onClickTerminosYCondiciones}>
          Términos y condiciones
        </p>
      </div>
    </div>
  );
}

export default Footer;
