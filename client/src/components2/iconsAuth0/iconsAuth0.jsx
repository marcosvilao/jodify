import React from "react";
import styles from "./iconsAuth0.module.css";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";

function IconsAuth0(props) {
  return (
    <div className={styles.bodyIcons}>
      <div className={styles.containerIcons}>
        <div className={styles.boxIcon} onClick={props.OnClickApple}>
          <AppleIcon
            sx={{
              color: "white",
              width: "35px",
              height: "35px",
            }}
          />
        </div>

        <div className={styles.boxIcon} onClick={props.OnClickGoogle}>
          <GoogleIcon
            sx={{
              color: "white",
              width: "30px",
              height: "30px",
            }}
          />
        </div>
      </div>

      <div className={styles.lineIconContainer}>
        <div className={styles.lineIcon}></div>
        <PanoramaFishEyeIcon style={{ fill: "#ffffff", width: "15px" }} />
        <div className={styles.lineIcon}></div>
      </div>
    </div>
  );
}

export default IconsAuth0;
