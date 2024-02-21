import React, { useState } from "react";
import styles from "./createPromotersPage.module.css";
import axios from "axios";
import Alert from "../../components2/alert/alert";
import InputFilled from "../../components2/inputBlack/inputBlack";
import SelectBlack from "../../components2/selectBlack/selectBlack";
import ButtonBlue from "../../components2/button/button";
import TittleH1 from "../../components2/tittleH1Auth/tittleH1";
import Loader from "../../components2/loader/loader";

function CreatePromotersPage() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const [loader, setLoader] = useState(false);
  const [dataPost, setDataPost] = useState({
    name: "",
    instagram: "",
    priority: "",
  });
  const arrayNumbers = [
    { value: "1" },
    { value: "2" },
    { value: "3" },
    { value: "4" },
  ];

  const onChangeInput = (e) => {
    setDataPost({
      ...dataPost,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeSelect = (event, value) => {
    event.preventDefault();
    if (typeof value === "string") {
      if (value) {
        let numero = parseInt(value);
        setDataPost({
          ...dataPost,
          priority: numero,
        });
      } else {
        setDataPost({
          ...dataPost,
          priority: "",
        });
      }
    } else {
      let numero = parseInt(value.value);
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
      Alert("Error!", "Completar todos los campos", "error");
    } else {
      setLoader(true);
      axios
        .post(axiosUrl + "/create-promoter", dataPost)
        .then(() => {
          setLoader(false);
          let callbackAlert = () => {
            window.location.reload();
          };
          Alert(
            "Success!",
            "Productora creada correctamente!",
            "success",
            callbackAlert
          );
        })
        .catch((error) => {
          setLoader(false);
          if (error.response.status === 404) {
            Alert("Error!", error.response.data.message, "error");
          } else {
            Alert("Error!", "Error interno del servidor", "error");
          }
        });
    }
  };

  return (
    <div className={styles.body}>
      <form className={styles.form}>
        <TittleH1 Value="Crear productora" />

        <InputFilled
          OnChange={onChangeInput}
          Name="name"
          Value={dataPost.name}
          Placeholder="escribi el nombre"
          Label="escribi el nombre"
        />

        <InputFilled
          OnChange={onChangeInput}
          Name="instagram"
          Value={dataPost.instagram}
          Placeholder="escribi el instagram"
          Label="escribi el instagram"
        />

        <div className={styles.containerSelect}>
          <SelectBlack
            Option="Selecciona la prioridad"
            Array={arrayNumbers}
            OnChange={onChangeSelect}
            Multiple={false}
          />
        </div>

        {!loader ? (
          <ButtonBlue Value="Submit" OnClick={onSubmit} />
        ) : (
          <Loader Color="#7c16f5" Height="30px" Width="30px" />
        )}
      </form>
    </div>
  );
}

export default CreatePromotersPage;
