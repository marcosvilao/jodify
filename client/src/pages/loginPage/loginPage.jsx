import React, { useState } from "react";
import styles from "./loginPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import LogoJodify from "../../components2/logoJodify/logoJodify";
import TittleH1 from "../../components2/tittleH1/tittleH1";
import IconsAuth0 from "../../components2/iconsAuth0/iconsAuth0";
import InputFilled from "../../components2/inputBlack/inputBlack";
import ButtonBlue from "../../components2/button/button";
import Parrafo from "../../components2/parrafo/parrafo";
import Alert from "../../components2/alert/alert";
import Loader from "../../components2/loader/loader";

function LoginPage() {
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
  const [errorPassword, setErrorPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });

  const onChangeDataPostEmail = (e) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
      e.target.value
    );

    setUserLogin((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (e.target.value.length === 0) {
      setErrorEmail("");
    } else if (!emailPattern) {
      setErrorEmail("Email inválido");
    } else {
      setErrorEmail("");
    }
  };

  const onChangeDataPostPassword = (e) => {
    const password = e.target.value;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const longitudValida = password.length >= 8;

    setUserLogin((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
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

  const onClickLogin = (e) => {
    if (userLogin.email.length === 0 && userLogin.password.length === 0) {
      setErrorEmail("Email invalido");
      setErrorPassword("Contraseña Invalida");
    } else if (errorEmail !== "") {
      setErrorEmail("Email invalido");
    } else if (errorPassword !== "") {
      setErrorPassword("Contraseña Invalida");
    } else {
      setLoader(true);
      axios
        .post(axiosUrl + "/login", userLogin)
        .then((res) => {
          setLoader(false);
          setUserLogin({
            email: "",
            password: "",
          });
          console.log(res.data);
          let callbackAlert = () => {
            cookie.set("username", res.data.username);
            cookie.set("email", res.data.email);
            history("/");
            window.scroll(0, 0);
          };
          Alert(
            "Success!",
            "Has iniciado sesion correctamente",
            "success",
            callbackAlert
          );
        })
        .catch((err) => {
          setLoader(false);
          Alert("Error!", err.response.data, "error");
        });
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.containerLeft}>
        <LogoJodify />

        <TittleH1 Value="Iniciar sesion con" />

        <IconsAuth0 Login="true" />

        <div className={styles.containerForm}>
          <InputFilled
            OnChange={onChangeDataPostEmail}
            Name="email"
            Value={userLogin.email}
            Placeholder="info@soundon.com"
            Label="Correo electronico"
            Error={errorEmail}
          />
          <InputFilled
            OnChange={onChangeDataPostPassword}
            Name="password"
            Value={userLogin.password}
            Label="Contraseña"
            Placeholder="Ingresa tu contraseña"
            Type="password"
            Error={errorPassword}
          />

          <div className={styles.containerRestablecerContraseña}>
            <Parrafo Value="¿Olvidaste tu contraseña?" />
            <Link className={styles.linkForm} to={"/reset-password"}>
              Restablecer
            </Link>
          </div>

          {!loader ? (
            <ButtonBlue Value="Iniciar sesion" OnClick={onClickLogin} />
          ) : (
            <Loader Color="#7c16f5" Height="30px" Width="30px" />
          )}

          <div className={styles.containerCrearCuenta}>
            <Parrafo Value="¿No tenes cuenta?" />
            <Link className={styles.linkForm} to={"/register-user"}>
              Registrate
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.containerRight}></div>
    </div>
  );
}

export default LoginPage;
