import React, { useState } from "react";
import styles from "./registerPromoterPage.module.css";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import LogoJodify from "../../components2/logoJodify/logoJodify";
import TittleH1 from "../../components2/tittleH1/tittleH1";
import InputFilled from "../../components2/inputFilled/inputFilled";
import ButtonBlue from "../../components2/buttonBlue/buttonBlue";
import Parrafo from "../../components2/parrafo/parrafo";
import Alert from "../../components2/alert/alert";

function RegisterPromoter() {
  const history = useNavigate();
  const cookie = new Cookies();
  const cookieName = cookie.get("username");
  const [state, setState] = useState(false);

  if (cookieName) {
    let callbackAlert = () => {
      history("/");
      window.scroll(0, 0);
    };
    Alert("Error!", "Ya estas logeado", "error", callbackAlert);
  }

  const onClickChangeState = () => {
    setState(true);
  };

  if (!state) {
    return (
      <div className={styles.body}>
        <div className={styles.containerLeft}>
          <LogoJodify />

          <div className={styles.containerTittle}>
            <TittleH1 Value="Amplia el alcance de tus eventos con Jodify" />
          </div>

          <div className={styles.containerForm}>
            <div className={styles.containerParrafos}>
              <Parrafo Value="1. Crear cuenta." />
              <Parrafo Value="2. Publica tu evento en nuestra cartelera junto con el link de venta" />
              <Parrafo Value="3. Alcanza mayor visibilidad" />
            </div>

            <ButtonBlue Value="Empezar" OnClick={onClickChangeState} />
          </div>
        </div>

        <div className={styles.containerRight}></div>
      </div>
    );
  } else {
    return (
      <div className={styles.body}>
        <div className={styles.containerLeft2}>
          <LogoJodify />
          <TittleH1 Value="Crear cuenta" />

          <div className={styles.containerForm}>
            <InputFilled
              Name="name"
              Placeholder="ej. SoundOn"
              Label="Nombre de la productora"
              Error=""
            />

            <InputFilled
              Name="phone"
              Placeholder="1155264839"
              Label="Telefono de contacto"
              Error=""
            />

            <InputFilled
              Name="link"
              Placeholder="ej. sound_on"
              Label="Instagram"
              Error=""
            />

            <ButtonBlue Value="Crear cuenta" />
          </div>
        </div>

        <div className={styles.containerRight2}></div>
      </div>
    );
  }
}

export default RegisterPromoter;
