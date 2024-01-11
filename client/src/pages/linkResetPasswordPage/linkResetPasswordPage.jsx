import React, { useState } from "react";
import styles from "./linkResetPasswordPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import CheckIcon from "@mui/icons-material/Check";
import LogoJodify from "../../components2/logoJodify/logoJodify";
import TittleH1 from "../../components2/tittleH1/tittleH1";
import InputBlack from "../../components2/inputBlack/inputBlack";
import ButtonBlue from "../../components2/buttonBlue/buttonBlue";
import Parrafo from "../../components2/parrafo/parrafo";
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
  const [success, setSuccess] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dataPost, setDataPost] = useState({
    password: "",
    confirmPassword: "",
  });

  const onChangeDataPost = (e) => {
    setDataPost({
      ...dataPost,
      [e.target.name]: e.target.value,
    });
  };

  const onClickRestablecerConstraseña = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isValidPassword = regex.test(dataPost.password);
    if (!dataPost.password || !dataPost.confirmPassword) {
      Alert("Error!", "Completar todos los campos", "error");
    } else if (dataPost.password !== dataPost.confirmPassword) {
      Alert(
        "Error!",
        "El campo de contraseña y repetir contraseña deben ser iguales",
        "error"
      );
    } else if (!isValidPassword) {
      Alert(
        "Error!",
        "La contraseña debe tener al menos 8 caracter, 1 mayuscula, 1 minuscula y 1 numero",
        "error"
      );
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
            <InputBlack
              OnChange={onChangeDataPost}
              Name="password"
              Value={dataPost.password}
              Placeholder="Contraseña"
              Type="password"
            />
            <InputBlack
              OnChange={onChangeDataPost}
              Name="confirmPassword"
              Value={dataPost.confirmPassword}
              Placeholder="Repetir Contraseña"
              Type="password"
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
