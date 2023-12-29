import React from "react";
import styles from "./registerUser.module.css";
import theme from "../../jodifyStyles";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import { Link } from "react-router-dom";

function FormRegisterUser() {
  return (
    <div className={styles.body}>
      <div className={styles.leftContainer}>
        <div className={styles.form}>
          <img
            style={{
              borderRadius: theme.jodify_borders._lg_border_radius,
              marginBottom: "25px",
            }}
            src={logo}
            alt="Error en la carga del logo"
            width="80px"
            height="80px"
          />

          <h1>Registrate con</h1>

          <div className={styles.containerIcons}>
            <div className={styles.boxIcon}>
              <AppleIcon
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "35px",
                  height: "35px",
                }}
              />
            </div>

            <div className={styles.boxIcon}>
              <GoogleIcon
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                }}
              />
            </div>
          </div>

          <input placeholder="Correo electronico" />

          <input placeholder="Contraseña" />

          <input placeholder="Repetir contraseña" />

          <button>Registrarse</button>

          <div className={styles.containerH3yH4}>
            <h3>¿Ya tenes una cuneta?</h3>
            <Link className={styles.link} to={"/login"}>Inicia sesion</Link>
          </div>
        </div>
      </div>

      <div className={styles.rigthContianer}></div>
    </div>
  );
}

export default FormRegisterUser;
