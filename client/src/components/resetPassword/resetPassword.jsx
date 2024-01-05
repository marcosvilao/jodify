import React, { useState } from "react";
import styles from "./resetPassword.module.css";
import theme from "../../jodifyStyles";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function ResetPassword() {
  const history = useNavigate();
  const [loader, setLoader] = useState(false);
  const [dataPost, setDataPost] = useState({
    email: "",
  });

  const onChangeDataPost = (e) => {
    setDataPost({
      ...dataPost,
      [e.target.name]: e.target.value,
    });
  };

  const onClickRestablecerConstraseña = () => {
    if (!dataPost.email) {
      Swal.fire({
        title: "Error!",
        text: "Completar todos los campos",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else {
      setLoader(true);
      axios
        .post("http://localhost:3001/reset-password", dataPost)
        .then((res) => {
          console.log(res);
          setLoader(false);
          Swal.fire({
            title: "Success!",
            text: "Te hemon enviado un Link al correo electronico",
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
              marginBottom: "10px",
            }}
            src={logo}
            alt="Error en la carga del logo"
            width="60PX"
            height="60PX"
          />

          <h1>Olvidaste tu contraseña?</h1>

          <p>
            Ingresa el correo electronico con el que te registraste y te
            enviaremos un enlace para restablecer tu contraseña
          </p>

          <input
            placeholder="Email"
            name="email"
            value={dataPost.email}
            onChange={onChangeDataPost}
          />

          {loader === false ? (
            <button onClick={onClickRestablecerConstraseña}>
              Enviar enlace
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

export default ResetPassword;
