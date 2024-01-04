import React, { useState } from "react";
import styles from "./crearContraseña.module.css";
import theme from "../../jodifyStyles";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

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
    }  else if (dataPost.password !== dataPost.confirmPassword) {
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
            <p>Al menos 8 caracteres</p>

            <p>Al menos 1 mayúscula</p>

            <p>Al menos 1 número</p>
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
