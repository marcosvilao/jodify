import React, { useState } from "react";
import styles from "./crearContraseña.module.css";
import theme from "../../jodifyStyles";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import Cookies from "universal-cookie";

function CrarContraseña() {
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
      Swal.fire({
        title: "Error!",
        text: "Completar todos los campos",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else if (dataPost.password !== dataPost.confirmPassword) {
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
        .post(`http://localhost:3001/reset-password/${id}/${token}`, dataPost)
        .then((res) => {
          console.log(res);
          setLoader(false);
          setSuccess(true);
        })
        .catch((err) => {
          console.log(err);
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
      {success === false ? (
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

            <h1>Nueva contraseña</h1>

            <input
              placeholder="Contraseña"
              name="password"
              type="password"
              value={dataPost.email}
              onChange={onChangeDataPost}
            />

            <input
              placeholder="Repetir contraseña"
              name="confirmPassword"
              type="password"
              value={dataPost.email}
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
              <button onClick={onClickRestablecerConstraseña}>
                Crear nueva contraseña
              </button>
            ) : (
              <Box sx={{ display: "flex", marginTop: "30px" }}>
                <CircularProgress color="secondary" />
              </Box>
            )}
          </div>
        </div>
      ) : (
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

            <h1 style={{ fontSize: "20px", marginTop: "50px" }}>
              Tu contraseña se ha modificado con exito!
            </h1>

            <button onClick={onClickRouteLogin}>Iniciar sesion</button>
          </div>
        </div>
      )}

      <div className={styles.rigthContianer}></div>
    </div>
  );
}

export default CrarContraseña;
