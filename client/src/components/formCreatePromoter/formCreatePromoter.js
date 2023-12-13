import React, { useState } from "react";
import styles from "./formCreatePromoter.module.css";
import theme from "../../jodifyStyles";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";
import Swal from "sweetalert2";
import axios from "axios";

function FormCreatePromoter() {
  const [dataPost, setDataPost] = useState({
    name: "",
    instagram: "",
    priority: "",
  });
  const arrayNumbers = [1, 2, 3, 4];

  const onChangeInput = (e) => {
    setDataPost({
      ...dataPost,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeSelect = (e) => {
    if (e.target.value === "Selecciona la prioridad") {
      setDataPost({
        ...dataPost,
        priority: "",
      });
    } else {
      let numero = parseInt(e.target.value);
      setDataPost({
        ...dataPost,
        priority: numero,
      });
    }
  };  

  const onSubmit = (e) => {
    e.preventDefault();

    if (
      dataPost.name === "" ||
      dataPost.instagram === "" ||
      dataPost.priority === ""
    ) {
      Swal.fire({
        title: "Error!",
        text: "Completar todos los campos",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else {
      axios
        .post("https://jodify.vercel.app/create-promoters", dataPost)
        .then((res) => {
          console.log(res);
          Swal.fire({
            title: "Success!",
            text: "Productora creada correctamente!",
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
           window.location.reload();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className={styles.body}>
      <form className={styles.form}>
        <a href="https://jodify.com.ar/">
          <img
            style={{
              borderRadius: theme.jodify_borders._lg_border_radius,
              marginLeft: "40%",
            }}
            src={logo}
            alt="jodify-logo"
            width="60px"
            height="60px"
          />
        </a>

        <div className={styles.containerForm}>
          <label>Name:</label>
          <input
            placeholder="escribi el nombre"
            name="name"
            onChange={onChangeInput}
            value={dataPost.name}
          ></input>
        </div>

        <div className={styles.containerForm}>
          <label>Instagram:</label>
          <input
            placeholder="escribi el instagram"
            name="instagram"
            onChange={onChangeInput}
            value={dataPost.instagram}
          ></input>
        </div>

        <div className={styles.containerForm}>
          <label>Priority:</label>
          <select onChange={onChangeSelect}>
            <option>Selecciona la prioridad</option>
            {arrayNumbers &&
              arrayNumbers.map((i) => {
                return <option>{i}</option>;
              })}
          </select>
        </div>

        <button onClick={onSubmit} className={styles.buttonForm}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormCreatePromoter;
