import React from "react";
import styles from "./bienvenidoProductora.module.css";
import theme from "../../jodifyStyles";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";

function ProductoraBienvenido() {
  const history = useNavigate();
  const cookie = new Cookies();
  const cookieName = cookie.get("username");

  if (cookieName) {
    Swal.fire({
      title: "Error!",
      text: "Ya estas logeado",
      icon: "error",
      confirmButtonText: "Ok",
    }).then(() => {
      history("/");
      window.scroll(0, 0);
    });
  }

  const onClickRouteCreateProductora = () => {
    history("/create-productora");
    window.scroll(0, 0);
  };
  return (
    <div className={styles.body}>
      <div className={styles.leftContainer}>
        <img
          style={{ borderRadius: theme.jodify_borders._lg_border_radius }}
          width="75px"
          height="75px"
          src={logo}
          alt="error al cargar el logo"
        />

        <h1>Amplia el alcance de tus eventos con Jodify</h1>

        <div className={styles.containerParrafos}>
          <p>1. Crea tu cuenta</p>

          <p>
            2. Publica tu evento en nuestra cartelera junto con el link de venta
          </p>

          <p>3. Alcanza mayor visibilidad</p>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={onClickRouteCreateProductora}
          >
            Empezar
          </button>
        </div>
      </div>

      <div className={styles.rightContainer}></div>
    </div>
  );
}

export default ProductoraBienvenido;
