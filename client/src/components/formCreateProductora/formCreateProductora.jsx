import React from "react";
import styles from "./formCreateProductora.module.css";
import theme from "../../jodifyStyles";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";

function FormCreateProductora() {
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

          <h1>Crear cuenta</h1>

          <input placeholder="Nombre de la productora" />

          <input placeholder="Telefono de contacto" />

          <input placeholder="Instagram" />

          <input placeholder="Sitio web" />

          <button>Crear Cuenta</button>
        </div>
      </div>

      <div className={styles.rigthContianer}></div>
    </div>
  );
}

export default FormCreateProductora;
