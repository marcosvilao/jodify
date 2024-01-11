import React, { useState } from "react";
import styles from "./loginPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import LogoJodify from "../../components2/logoJodify/logoJodify";
import TittleH1 from "../../components2/tittleH1/tittleH1";
import IconsAuth0 from "../../components2/iconsAuth0/iconsAuth0";
import InputBlack from "../../components2/inputBlack/inputBlack";
import ButtonBlue from "../../components2/buttonBlue/buttonBlue";
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

  const [loader, setLoader] = useState(false);
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });

  const onChangeDataPost = (e) => {
    setUserLogin({
      ...userLogin,
      [e.target.name]: e.target.value,
    });
  };

  const onClickLogin = (e) => {
    if (!userLogin.email || !userLogin.password) {
      Alert("Error!", "Completar todos los campos", "error");
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

        <IconsAuth0 />

        <div className={styles.containerForm}>
          <InputBlack
            OnChange={onChangeDataPost}
            Name="email"
            Value={userLogin.email}
            Placeholder="Correo electronico"
          />
          <InputBlack
            OnChange={onChangeDataPost}
            Name="password"
            Value={userLogin.password}
            Placeholder="Contraseña"
            Type="password"
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
