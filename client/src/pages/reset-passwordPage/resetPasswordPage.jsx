import React, { useState } from "react";
import styles from "./resetPasswordPage.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import LogoJodify from "../../components2/logoJodify/logoJodify";
import TittleH1 from "../../components2/tittleH1/tittleH1";
import InputFilled from "../../components2/inputFilled/inputFilled";
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

  const [errorEmail, setErrorEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dataPost, setDataPost] = useState({
    email: "",
  });

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
    dataPost.email
  );

  const onChangeDataPost = (e) => {
    setDataPost({
      ...dataPost,
      [e.target.name]: e.target.value,
    });

    if (e.target.value.length === 0) {
      setErrorEmail("");
    } else if (!emailPattern) {
      setErrorEmail("Email invalido");
    } else if (emailPattern) {
      setErrorEmail("");
    }
  };

  const onClickRestablecerConstraseña = () => {
    if (!dataPost.email) {
      setErrorEmail("Email invalido");
    } else if (errorEmail !== "") {
      setErrorEmail("Email invalido");
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

            <InputFilled
              OnChange={onChangeDataPost}
              Name="email"
              Value={dataPost.email}
              Placeholder="Correo electronico con el que te registraste"
              Label="Correo electronico"
              Error={errorEmail}
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
