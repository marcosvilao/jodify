import React, { useState } from "react";
import styles from "./registerPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import CheckIcon from "@mui/icons-material/Check";
import LogoJodify from "../../components2/logoJodify/logoJodify";
import TittleH1 from "../../components2/tittleH1Auth/tittleH1";
import IconsAuth0 from "../../components2/iconsAuth0/iconsAuth0";
import InputFilled from "../../components2/inputBlack/inputBlack";
import ButtonBlue from "../../components2/ButtonCreateEvents/button";
import Parrafo from "../../components2/parrafoAuth/parrafo";
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

  const [errorUsername, setErrorUsername] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorRepeatPassword, setErrorRepeatPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [postUser, setPostUser] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "user",
  });

  const onChangeDataPostUsername = (e) => {
    setPostUser({
      ...postUser,
      [e.target.name]: e.target.value,
    });

    if (e.target.value.length === 0) {
      setErrorUsername("");
    } else if (e.target.value.length < 3 && e.target.value.length > 0) {
      setErrorUsername("Minimo 3 caracrteres");
    } else {
      setErrorUsername("");
    }
  };

  const onChangeDataPostEmail = (e) => {
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
      e.target.value
    );

    setPostUser({
      ...postUser,
      [e.target.name]: e.target.value,
    });

    if (e.target.value.length === 0) {
      setErrorEmail("");
    } else if (!emailPattern) {
      setErrorEmail("Email inválido");
    } else {
      setErrorEmail("");
    }
  };

  const onChangeDataPostPassword = (e) => {
    let password = e.target.value;
    let tieneMayuscula = /[A-Z]/.test(password);
    let tieneMinuscula = /[a-z]/.test(password);
    let tieneNumero = /[0-9]/.test(password);
    let longitudValida = password.length >= 8;

    setPostUser({
      ...postUser,
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
    setPostUser({
      ...postUser,
      [e.target.name]: e.target.value,
    });

    if (e.target.value.length === 0) {
      setErrorRepeatPassword("");
    } else if (postUser.password !== e.target.value) {
      setErrorRepeatPassword("Repetir contraseña Inválida");
    } else {
      setErrorRepeatPassword("");
    }
  };

  const tieneMayuscula = /[A-Z]/.test(postUser.password);
  const tieneNumero = /[0-9]/.test(postUser.password);
  const longitudValida = postUser.password.length >= 8;

  var errorLength = false;
  var errorCapitalLeter = false;
  var errorNumber = false;

  if (longitudValida) {
    errorLength = true;
  } else {
    errorLength = false;
  }

  if (tieneMayuscula) {
    errorCapitalLeter = true;
  } else {
    errorCapitalLeter = false;
  }

  if (tieneNumero) {
    errorNumber = true;
  } else {
    errorNumber = false;
  }

  const onClickDataPost = () => {
    if (
      postUser.email.length === 0 &&
      postUser.password.length === 0 &&
      postUser.repeatPassword.length === 0 &&
      postUser.username.length === 0
    ) {
      setErrorUsername("Minimo 3 caracrteres");
      setErrorEmail("Email Inválido");
      setErrorPassword("Contraseña Inválida");
      setErrorRepeatPassword("Repetir contraseña Inválida");
    } else if (errorUsername !== "" || postUser.username.length === 0) {
      setErrorUsername("Minimo 3 caracrteres");
    } else if (errorEmail !== "" || postUser.email.length === 0) {
      setErrorEmail("Email Inválido");
    } else if (errorPassword !== "" || postUser.password.length === 0) {
      setErrorPassword("Contraseña Inválida");
    } else if (
      errorRepeatPassword !== "" ||
      postUser.repeatPassword.length === 0
    ) {
      setErrorRepeatPassword("Repetir contraseña Inválida");
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
            history("/login");
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

  return (
    <div className={styles.body}>
      <div className={styles.containerLeft}>
        <LogoJodify />

        <TittleH1 Value="Registrate con" />

        <IconsAuth0 Register="true" />

        <div className={styles.containerForm}>
          <InputFilled
            OnChange={onChangeDataPostUsername}
            Name="username"
            Value={postUser.username}
            Placeholder="ej. JodifySoundOn"
            Label="Username"
            Error={errorUsername}
          />
          <InputFilled
            OnChange={onChangeDataPostEmail}
            Name="email"
            Value={postUser.email}
            Placeholder="info@soundon.com"
            Label="Correo electronico"
            Error={errorEmail}
          />
          <InputFilled
            OnChange={onChangeDataPostPassword}
            Name="password"
            Value={postUser.password}
            Placeholder="Ingresa tu contraseña"
            Label="Contraseña"
            Type="password"
            Error={errorPassword}
          />
          <InputFilled
            OnChange={onChangeDataPostRepeatPassword}
            Name="repeatPassword"
            Value={postUser.repeatPassword}
            Placeholder="Repeti tu contraseña"
            Label="Repetir contraseña"
            Type="password"
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
