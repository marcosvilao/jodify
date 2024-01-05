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

function CrarContraseña() {
  const history = useNavigate();
  const { id, token } = useParams();
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
          Swal.fire({
            title: "Success!",
            text: "Contraseña restablecida correctamente",
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
            history("/login");
            window.scroll(0, 0);
          });
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

      <div className={styles.rigthContianer}></div>
    </div>
  );
}

export default CrarContraseña;
