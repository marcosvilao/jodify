import React, { useState } from "react";
import styles from "./resetPasswordPage.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import LogoJodify from "../../components2/logoJodify/logoJodify";
import TittleH1 from "../../components2/tittleH1/tittleH1";
import InputBlack from "../../components2/inputBlack/inputBlack";
import ButtonBlue from "../../components2/buttonBlue/buttonBlue";
import Parrafo from "../../components2/parrafo/parrafo";
import Alert from "../../components2/alert/alert";
import Loader from "../../components2/loader/loader";

function ResetPassword() {
  const history = useNavigate();
  const cookie = new Cookies();
  const cookieName = cookie.get("username");
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;

  if (cookieName) {
    let callbackAlert = () => {
      history("/");
      window.scroll(0, 0);
    };
    Alert("Error!", "Ya estas logeado", "error", callbackAlert);
  }

  const [sent, setSent] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dataPost, setDataPost] = useState({
    email: "",
  });

  const onChangeDataPost = (e) => {
    setDataPost({
      ...dataPost,
      [e.target.name]: e.target.value,
    });
  };

  const onClickRestablecerConstraseña = () => {
    if (!dataPost.email) {
      Alert("Error!", "Completar todos los campos", "error");
    } else {
      setLoader(true);
      axios
        .post(axiosUrl + "/reset-password", dataPost)
        .then(() => {
          setLoader(false);
          setSent(true);
        })
        .catch((err) => {
          setLoader(false);
          Alert("Error!", err.response.data, "error");
        });
    }
  };

  const onClickRouteLogin = () => {
    history("/login");
    window.scroll(0, 0);
  };

  return (
    <div className={styles.body}>
      {!sent ? (
        <div className={styles.containerLeft}>
          <LogoJodify />
          <TittleH1 Value="Olvidaste tu contraseña?" />

          <div className={styles.containerForm}>
            <Parrafo
              Value="Ingresa el correo electronico con el que te registraste y te
                      enviaremos un enlace para restablecer tu contraseña."
            />

            <InputBlack
              OnChange={onChangeDataPost}
              Name="email"
              Value={dataPost.email}
              Placeholder="Correo electronico con el que te registraste"
              Label="Correo electronico"
            />

            {!loader ? (
              <ButtonBlue
                Value="Enviar enlace"
                OnClick={onClickRestablecerConstraseña}
              />
            ) : (
              <Loader Color="#7c16f5" Height="30px" Width="30px" />
            )}
          </div>
        </div>
      ) : (
        <div className={styles.containerLeft}>
          <LogoJodify />
          <TittleH1 Value="Correo electronico enviado" />

          <div className={styles.containerForm}>
            <Parrafo
              Value="Te hemos enviado un correo electronico con el 
               enlace para que puedas crear una contraseña nueva."
            />

            <ButtonBlue Value="Iniciar sesion" OnClick={onClickRouteLogin} />
          </div>
        </div>
      )}

      <div className={styles.containerRight}></div>
    </div>
  );
}

export default ResetPassword;
