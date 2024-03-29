import React, { useState } from "react";
import styles from "./linkResetPasswordPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import CheckIcon from "@mui/icons-material/Check";
import LogoJodify from "../../components2/logoJodify/logoJodify";
import TittleH1 from "../../components2/tittleH1Auth/tittleH1";
import InputFilled from "../../components2/inputMaterial/inputMaterial";
import ButtonBlue from "../../components2/ButtonCreateEvents/button";
import Parrafo from "../../components2/parrafoAuth/parrafo";
import Alert from "../../components2/alert/alert";
import Loader from "../../components2/loader/loader";

function LinkResetPassword() {
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

  const { id, token } = useParams();
  const [errorPassword, setErrorPassword] = useState("");
  const [errorRepeatPassword, setErrorRepeatPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dataPost, setDataPost] = useState({
    password: "",
    confirmPassword: "",
  });

  const onChangeDataPostPassword = (e) => {
    let password = e.target.value;
    let tieneMayuscula = /[A-Z]/.test(password);
    let tieneMinuscula = /[a-z]/.test(password);
    let tieneNumero = /[0-9]/.test(password);
    let longitudValida = password.length >= 8;

    setDataPost({
      ...dataPost,
      [e.target.name]: e.target.value,
    });
    if (e.target.value.length === 0) {
      setErrorPassword("");
    } else if (
      !longitudValida ||
      !tieneMayuscula ||
      !tieneMinuscula ||
      !tieneNumero
    ) {
      setErrorPassword("Contraseña Inválida");
    } else {
      setErrorPassword("");
    }
  };

  const onChangeDataPostRepeatPassword = (e) => {
    setDataPost({
      ...dataPost,
      [e.target.name]: e.target.value,
    });

    if (e.target.value.length === 0) {
      setErrorRepeatPassword("");
    } else if (dataPost.password !== e.target.value) {
      setErrorRepeatPassword("Repetir contraseña Inválida");
    } else {
      setErrorRepeatPassword("");
    }
  };

  const onClickRestablecerConstraseña = () => {
    if (
      dataPost.password.length === 0 &&
      dataPost.confirmPassword.length === 0
    ) {
      setErrorPassword("Contraseña Inválida");
      setErrorRepeatPassword("Repetir contraseña Inválida");
    } else if (errorPassword !== "" || dataPost.password.length === 0) {
      setErrorPassword("Contraseña Inválida");
    } else if (
      errorRepeatPassword !== "" ||
      dataPost.confirmPassword.length === 0
    ) {
      setErrorRepeatPassword("Repetir contraseña Inválida");
    } else {
      setLoader(true);
      axios
        .post(axiosUrl + `/reset-password/${id}/${token}`, dataPost)
        .then(() => {
          setLoader(false);
          setSuccess(true);
        })
        .catch((err) => {
          setLoader(false);
          Alert("Error!", err.response.data, "error");
        });
    }
  };

  var errorLength = false;

  if (dataPost.password.length > 7) {
    errorLength = true;
  } else {
    errorLength = false;
  }

  var errorCapitalLeter = false;

  for (let i = 0; i < dataPost.password.length; i++) {
    if (/[A-Z]/.test(dataPost.password[i])) {
      errorCapitalLeter = true;
      break; // Si encuentras una letra mayúscula, puedes salir del bucle
    } else {
      errorCapitalLeter = false;
    }
  }

  var errorNumber = false;

  for (let i = 0; i < dataPost.password.length; i++) {
    if (/\d/.test(dataPost.password[i])) {
      errorNumber = true;
      break; // Si encuentras un número, puedes salir del bucle
    } else {
      errorNumber = false;
    }
  }

  const onClickRouteLogin = (e) => {
    history("/login");
  };

  return (
    <div className={styles.body}>
      {!success ? (
        <div className={styles.containerLeft}>
          <LogoJodify />

          <TittleH1 Value="Nueva Contraseña" />

          <div className={styles.containerForm}>
            <InputFilled
              OnChange={onChangeDataPostPassword}
              Name="password"
              Value={dataPost.password}
              Placeholder="Ingresar nueva Contraseña"
              Type="password"
              Label="Nueva Contraseña"
              Error={errorPassword}
            />
            <InputFilled
              OnChange={onChangeDataPostRepeatPassword}
              Name="confirmPassword"
              Value={dataPost.confirmPassword}
              Placeholder="Confirmar nueva contraseña"
              Type="password"
              Label="Confirmar nueva contraseña"
              Error={errorRepeatPassword}
            />

            <div className={styles.containerPform}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Parrafo Value="Al menos 8 caracteres" Margin="2px" />
                {errorLength === false ? null : (
                  <CheckIcon
                    style={{
                      width: "15px",
                      color: "yellow",
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Parrafo Value="Al menos 1 mayúscula" Margin="2px" />
                {errorCapitalLeter === false ? null : (
                  <CheckIcon
                    style={{
                      width: "15px",
                      color: "yellow",
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Parrafo Value="Al menos 1 número" Margin="2px" />
                {errorNumber === false ? null : (
                  <CheckIcon
                    style={{
                      width: "15px",
                      color: "yellow",
                    }}
                  />
                )}
              </div>
            </div>

            {!loader ? (
              <ButtonBlue
                Value="Crear nueva contraseña"
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

          <div className={styles.containerForm}>
            <Parrafo Value="Tu contraseña se ha modificado con exito!" />

            <ButtonBlue Value="Inicar sesion" OnClick={onClickRouteLogin} />
          </div>
        </div>
      )}

      <div className={styles.containerRight}></div>
    </div>
  );
}

export default LinkResetPassword;
