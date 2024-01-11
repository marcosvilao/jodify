import React, { useState } from "react";
import styles from "./registerPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import CheckIcon from "@mui/icons-material/Check";
import LogoJodify from "../../components2/logoJodify/logoJodify";
import TittleH1 from "../../components2/tittleH1/tittleH1";
import IconsAuth0 from "../../components2/iconsAuth0/iconsAuth0";
import InputBlack from "../../components2/inputBlack/inputBlack";
import ButtonBlue from "../../components2/buttonBlue/buttonBlue";
import Parrafo from "../../components2/parrafo/parrafo";
import Alert from "../../components2/alert/alert";
import Loader from "../../components2/loader/loader";

function RegisterPage() {
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

  const [loader, setLoader] = useState(false);
  const [postUser, setPostUser] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "user",
  });

  const onChangeDataPost = (e) => {
    setPostUser({
      ...postUser,
      [e.target.name]: e.target.value,
    });
  };

  const onClickDataPost = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isValidPassword = regex.test(postUser.password);
    if (
      !postUser.username ||
      !postUser.email ||
      !postUser.password ||
      !postUser.repeatPassword ||
      !postUser.role
    ) {
      Alert("Error!", "Completar todos los campos", "error");
    } else if (postUser.password !== postUser.repeatPassword) {
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
        .post(axiosUrl + "/create-users", postUser)
        .then((res) => {
          setLoader(false);

          let callbackAlert = () => {
            setPostUser({
              username: "",
              email: "",
              password: "",
              repeatPassword: "",
              role: "user",
            });
            history("/");
            window.scroll(0, 0);
          };
          Alert("Success!", res.data, "success", callbackAlert);
        })
        .catch((err) => {
          setLoader(false);

          let callbackAlert = () => {
            setPostUser({
              username: "",
              email: "",
              password: "",
              repeatPassword: "",
              role: "user",
            });
          };
          Alert("Error!", err.response.data, "error", callbackAlert);
        });
    }
  };

  var errorLength = false;

  if (postUser.password.length > 7) {
    errorLength = true;
  } else {
    errorLength = false;
  }

  var errorCapitalLeter = false;

  for (let i = 0; i < postUser.password.length; i++) {
    if (/[A-Z]/.test(postUser.password[i])) {
      errorCapitalLeter = true;
      break; // Si encuentras una letra mayúscula, puedes salir del bucle
    } else {
      errorCapitalLeter = false;
    }
  }

  var errorNumber = false;

  for (let i = 0; i < postUser.password.length; i++) {
    if (/\d/.test(postUser.password[i])) {
      errorNumber = true;
      break; // Si encuentras un número, puedes salir del bucle
    } else {
      errorNumber = false;
    }
  }
  return (
    <div className={styles.body}>
      <div className={styles.containerLeft}>
        <LogoJodify />

        <TittleH1 Value="Registrate con" />

        <IconsAuth0 />

        <div className={styles.containerForm}>
          <InputBlack
            OnChange={onChangeDataPost}
            Name="username"
            Value={postUser.username}
            Placeholder="Username"
          />
          <InputBlack
            OnChange={onChangeDataPost}
            Name="email"
            Value={postUser.email}
            Placeholder="Correo electronico"
          />
          <InputBlack
            OnChange={onChangeDataPost}
            Name="password"
            Value={postUser.password}
            Placeholder="Contraseña"
            Type="password"
          />
          <InputBlack
            OnChange={onChangeDataPost}
            Name="repeatPassword"
            Value={postUser.repeatPassword}
            Placeholder="Repetir contraseña"
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
            <ButtonBlue Value="Registrate" OnClick={onClickDataPost} />
          ) : (
            <Loader Color="#7c16f5" Height="30px" Width="30px" />
          )}

          <div className={styles.containerCrearCuenta}>
            <Parrafo Value="¿Ya tenes una cuenta?" />
            <Link className={styles.linkForm} to={"/login"}>
              Inicar sesion
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.containerRight}></div>
    </div>
  );
}

export default RegisterPage;
