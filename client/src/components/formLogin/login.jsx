import React, { useState } from "react";
import styles from "./login.module.css";
import theme from "../../jodifyStyles";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Cookies from "universal-cookie";

function FormLogin() {
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

  const history = useNavigate();
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
      Swal.fire({
        title: "Error!",
        text: "Completar todos los campos",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else {
      setLoader(true);
      axios
        .post("http://localhost:3001/login", userLogin)
        .then((res) => {
          setLoader(false);
          setUserLogin({
            email: "",
            password: "",
          });
          Swal.fire({
            title: "Success!",
            text: "Has iniciado sesion correctamente",
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
            cookie.set("username", res.data.username);
            cookie.set("email", res.data.email);
            history("/");
            window.scroll(0, 0);
          });
        })
        .catch((err) => {
          setLoader(false);
          Swal.fire({
            title: "Error!",
            text: err.response.data,
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    }
  };
  return (
    <div className={styles.body}>
      <div className={styles.leftContainer}>
        <div className={styles.form}>
          <img
            style={{
              borderRadius: theme.jodify_borders._lg_border_radius,
              marginBottom: "25px",
            }}
            src={logo}
            alt="Error en la carga del logo"
            width="80px"
            height="80px"
          />

          <h1>Iniciar sesion con</h1>

          <div className={styles.containerIcons}>
            <div className={styles.boxIcon}>
              <AppleIcon
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "35px",
                  height: "35px",
                }}
              />
            </div>

            <div className={styles.boxIcon}>
              <GoogleIcon
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                }}
              />
            </div>
          </div>

          <input
            placeholder="Email o Username"
            name="email"
            value={userLogin.email}
            onChange={onChangeDataPost}
          />

          <input
            placeholder="Contraseña"
            type="password"
            name="password"
            value={userLogin.password}
            onChange={onChangeDataPost}
          />

          {loader === false ? (
            <button onClick={onClickLogin}>Iniciar sesion</button>
          ) : (
            <Box sx={{ display: "flex", marginTop: "30px" }}>
              <CircularProgress color="secondary" />
            </Box>
          )}

          <div className={styles.containerH3yH4}>
            <h3>¿Olvidaste tu contraseña?</h3>
            <Link className={styles.link} to={"/login"}>
              Restablecer
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.rigthContianer}></div>
    </div>
  );
}

export default FormLogin;
