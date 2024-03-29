import React, { useState, useEffect } from "react";
import styles from "./createDjs.module.css";
import axios from "axios";
import Alert from "../../components2/alert/alert";
import SelectMaterial from "../../components2/selectMaterial/selectMaterial";
import InputFilled from "../../components2/inputMaterial/inputMaterial";
import ButtonBlue from "../../components2/ButtonCreateEvents/button";
import TittleH1 from "../../components2/tittleH1Auth/tittleH1";
import Loader from "../../components2/loader/loader";

function CreatePromotersPage() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const [loader, setLoader] = useState(false);
  const [djs, setDjs] = useState(false);
  const [types, setTypes] = useState(false);
  const [errorLineUp, setErrorLineUp] = useState("");
  const [errorGeneros, setErrorGeneros] = useState("");
  const [errorInstagram, setErrorInstagram] = useState("");
  const [dataPost, setDataPost] = useState({
    type: [],
    name: [],
    instagram: "",
  });

  const onChangeInput = (e) => {
    setDataPost({
      ...dataPost,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeEventDjs = (event, value) => {
    let arrayDjs = [];
    for (let i = 0; i < value.length; i++) {
      if (value[i].value) {
        arrayDjs.push(value[i].value);
      } else {
        arrayDjs.push(value[i]);
      }
    }

    setErrorLineUp("");
    setDataPost({
      ...dataPost,
      name: arrayDjs,
    });
  };

  const onChangeEventType = (event, value) => {
    let arrayTypes = [];
    for (let i = 0; i < value.length; i++) {
      if (value[i].value) {
        arrayTypes.push(value[i].value);
      } else {
        arrayTypes.push(value[i]);
      }
    }

    setErrorGeneros("");
    setDataPost({
      ...dataPost,
      type: arrayTypes,
    });
  };

  const onSubmit = () => {
    setLoader(true);
    if (dataPost.type.length === 0 || dataPost.name.length === 0) {
      Alert("", "Completar todos los campos", "");
      setLoader(false);

      if (dataPost.type.length === 0) {
        setErrorLineUp("Completar campo");
      }

      if (dataPost.name.length === 0) {
        setErrorGeneros("Completar campo");
      }

      if (dataPost.instagram.length === 0) {
        setErrorInstagram("Completar campo");
      }
    } else {
      let callbackAlert = () => {
        window.location.reload();
      };
      Alert("Success!", "Dj creado correctamente!", "success", callbackAlert);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!types) {
      axios
        .get(axiosUrl + "/types")
        .then((res) => {
          const arrayTypes = [];
          res.data.map((type) => {
            arrayTypes.push({ value: type.name });
          });
          setTypes(arrayTypes);
        })
        .catch(() => {
          Alert("Error!", "Error interno del servidor", "error");
        });
    }

    if (!djs) {
      axios
        .get(axiosUrl + "/djs")
        .then((res) => {
          const arrayDjs = [];
          const newArrayDjs = [];
          res.data.map((djs) => {
            arrayDjs.push({ value: djs.name });
          });
          const arrayDjsSet = new Set(arrayDjs.map((objeto) => objeto.value));
          let arrayNoDuplicates = Array.from(arrayDjsSet);
          arrayNoDuplicates.map((djs) => {
            newArrayDjs.push({ value: djs });
          });
          setDjs(newArrayDjs);
        })
        .catch(() => {
          Alert("Error!", "Error interno del servidor", "error");
        });
    }
  }, []);

  return (
    <div className={styles.body}>
      <form className={styles.form}>
        <TittleH1 Value="Crear Djs" />

        <div className={styles.containerSelect}>
          <SelectMaterial
            Option="Agregar Djs"
            Array={djs}
            OnChange={onChangeEventDjs}
            Margin="10px 0px 0px 0px"
            Error={errorLineUp}
          />
        </div>

        <div className={styles.containerSelect}>
          <SelectMaterial
            Option="Géneros musicales"
            Array={types}
            OnChange={onChangeEventType}
            Margin="10px 0px 0px 0px"
            Error={errorGeneros}
          />
        </div>

        <div className={styles.containerSelect}>
          <InputFilled
            OnChange={onChangeInput}
            Name="instagram"
            Value={dataPost.instagram}
            Placeholder="escribi el instagram"
            Label="escribi el instagram"
            Margin="10px 0px 25px 0px"
            Error={errorInstagram}
          />
        </div>

        {!loader ? (
          <div className={styles.containerSelect}>
            <ButtonBlue Value="Submit" OnClick={onSubmit} />
          </div>
        ) : (
          <Loader Color="#7c16f5" Height="30px" Width="30px" />
        )}
      </form>
    </div>
  );
}

export default CreatePromotersPage;
