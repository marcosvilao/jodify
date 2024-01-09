import React, { useState } from "react";
import styles from "./registerUser.module.css";
import theme from "../../jodifyStyles";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import Cookies from "universal-cookie";

function FormRegisterUser() {
  const history = useNavigate();
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
      Swal.fire({
        title: "Error!",
        text: "Completar todos los campos",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else if (postUser.password !== postUser.repeatPassword) {
      Swal.fire({
        title: "Error!",
        text: "El campo de contraseña y repetir contraseña deben ser iguales",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else if (!isValidPassword) {
      Swal.fire({
        title: "Error!",
        text: "La contraseña debe tener al menos 8 caracter, 1 mayuscula, 1 minuscula y 1 numero",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else {
      setLoader(true);
      axios
        .post("http://localhost:3001/create-users", postUser)
        .then((res) => {
          setLoader(false);
          Swal.fire({
            title: "Success!",
            text: res.data,
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
            setPostUser({
              username: "",
              email: "",
              password: "",
              repeatPassword: "",
              role: "user",
            });
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
          }).then(() => {
            setPostUser({
              username: "",
              email: "",
              password: "",
              repeatPassword: "",
              role: "user",
            });
            history("/");
            window.scroll(0, 0);
          });
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
      <div className={styles.leftContainer}>
        <div className={styles.form}>
          <img
            style={{
              borderRadius: theme.jodify_borders._lg_border_radius,
              marginBottom: "10px",
            }}
            src={logo}
            alt="Error en la carga del logo"
            width="60px"
            height="60px"
          />

          <h1>Registrate con</h1>

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

          <div className={styles.lineIconContainer}>
            <div className={styles.lineIcon}></div>
            <PanoramaFishEyeIcon style={{ fill: "#ffffff", width: "15px" }} />
            <div className={styles.lineIcon}></div>
          </div>

          <input
            placeholder="Username"
            name="username"
            value={postUser.username}
            onChange={onChangeDataPost}
          />

          <input
            placeholder="Correo electronico"
            name="email"
            value={postUser.email}
            onChange={onChangeDataPost}
          />

          <input
            placeholder="Contraseña"
            name="password"
            type="password"
            value={postUser.password}
            onChange={onChangeDataPost}
          />

          <input
            placeholder="Repetir contraseña"
            name="repeatPassword"
            type="password"
            value={postUser.repeatPassword}
            onChange={onChangeDataPost}
          />

          <div className={styles.containerPform}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <p>Al menos 8 caracteres</p>
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
              <p>Al menos 1 mayúscula</p>
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
              <p>Al menos 1 número</p>
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

          {loader === false ? (
            <button onClick={onClickDataPost}>Registrarse</button>
          ) : (
            <Box sx={{ display: "flex", marginTop: "30px" }}>
              <CircularProgress color="secondary" />
            </Box>
          )}

          <div className={styles.containerH3yH4}>
            <h3>¿Ya tenes una cuneta?</h3>
            <Link className={styles.link} to={"/login"}>
              Inicia sesion
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.rigthContianer}></div>
    </div>
  );
}

export default FormRegisterUser;
