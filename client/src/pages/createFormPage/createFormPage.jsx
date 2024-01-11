import React, { useEffect, useState } from "react";
import styles from "./createFormPage.module.css";
import SelectBlack from "../../components2/selectBlack/selectBlack";
import InputBlack from "../../components2/inputBlack/inputBlack";
import ButtonBlue from "../../components2/buttonBlue/buttonBlue";
import axios from "axios";
import Loader from "../../components2/loader/loader";
import Parrafo from "../../components2/parrafo/parrafo";
import Alert from "../../components2/alert/alert";

function CreateFormPage() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const cloudinayUrl = process.env.REACT_APP_CLOUDINARY_URL;
  const [loader, setLoader] = useState(false);
  const [cities, setCities] = useState(false);
  const [types, setTypes] = useState(false);
  const [djs, setDjs] = useState(false);
  const [promoters, setPromoters] = useState(false);
  const [dataPost, setDataPost] = useState({
    event_title: "",
    event_type: "",
    event_date: "",
    event_location: "",
    ticket_link: "",
    event_image: "",
    event_djs: "",
    event_city: "",
    event_promoter: "",
  });

  useEffect(() => {
    axios
      .get(axiosUrl + "/cities")
      .then((res) => {
        const arrayCities = [];
        res.data.map((citie) => {
          arrayCities.push({ value: citie.city_name });
        });
        setCities(arrayCities);
      })
      .catch(() => {
        Alert("Error!", "Error interno del servidor", "error");
      });

    axios
      .get(axiosUrl + "/types")
      .then((res) => {
        const arrayTypes = [];
        res.data.map((type) => {
          arrayTypes.push({ value: type.type_name });
        });
        setTypes(arrayTypes);
      })
      .catch(() => {
        Alert("Error!", "Error interno del servidor", "error");
      });

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

    axios
      .get(axiosUrl + "/promoters")
      .then((res) => {
        const arrayPromoters = [];
        res.data.map((promoter) => {
          arrayPromoters.push({ value: promoter.name });
        });
        setPromoters(arrayPromoters);
      })
      .catch(() => {
        Alert("Error!", "Error interno del servidor", "error");
      });
  }, []);

  if (cities && types && djs && promoters) {
    const onChangeEventCity = (e) => {
      setDataPost({
        ...dataPost,
        event_city: e.target.value,
      });
    };

    const onChangeEventType = (e) => {
      if (dataPost.event_type.length === 0) {
        setDataPost({
          ...dataPost,
          event_type: e.target.value,
        });
      } else {
        setDataPost({
          ...dataPost,
          event_type: dataPost.event_type + " | " + e.target.value,
        });
      }
    };

    const onChangeEventPromoters = (e) => {
      if (dataPost.event_promoter.length === 0) {
        setDataPost({
          ...dataPost,
          event_promoter: e.target.value,
        });
      } else {
        setDataPost({
          ...dataPost,
          event_promoter: dataPost.event_promoter + " | " + e.target.value,
        });
      }
    };

    const onChangeEventDjs = (e) => {
      if (dataPost.event_djs.length === 0) {
        setDataPost({
          ...dataPost,
          event_djs: e.target.value,
        });
      } else {
        setDataPost({
          ...dataPost,
          event_djs: dataPost.event_djs + " | " + e.target.value,
        });
      }
    };

    const onChangeDataInput = (e) => {
      setDataPost({
        ...dataPost,
        [e.target.name]: e.target.value,
      });
    };

    const onSubmit = () => {
      if (
        dataPost.event_title.length === 0 ||
        dataPost.event_type.length === 0 ||
        dataPost.event_date.length === 0 ||
        dataPost.event_location.length === 0 ||
        dataPost.ticket_link.length === 0 ||
        dataPost.event_image.length === 0 ||
        dataPost.event_djs.length === 0 ||
        dataPost.event_city.length === 0 ||
        dataPost.event_promoter.length === 0
      ) {
        Alert("Error!", "Completar todos los campos", "error");
      } else {
        axios
          .post(axiosUrl + "/events", dataPost)
          .then(() => {
            Alert("Success!", "Evento creado correctamente", "success");
          })
          .catch(() => {
            Alert("Error!", "Error interno del servidor", "error");
          });
      }
    };

    const handleFileChange = async (e) => {
      setLoader(true);
      const file = e.target.files[0];
      if (file) {
        if (file.type.startsWith("image/")) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "jodifyCloudinary");
          formData.append("jodify", "");
          fetch(cloudinayUrl + "/image/upload", {
            method: "post",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              const secureUrl = data.url.startsWith("http://")
                ? data.url.replace(/^http:/, "https:")
                : data.url;

              setDataPost((dataPost) => ({
                ...dataPost,
                event_image: secureUrl,
              }));
              setLoader(false);
            });
        } else {
          Alert("Error!", "Selected file is not an image", "error");
          setLoader(false);
        }
      }
    };

    console.log(cloudinayUrl);
    return (
      <div className={styles.body}>
        <div className={styles.form}>
          <h1 style={{ color: "white" }}>Create Form</h1>
          <SelectBlack
            Option="Selecciona una Ciudad"
            Array={cities}
            OnChange={onChangeEventCity}
            name="event_city"
          />

          <SelectBlack
            Option="Selecciona una Productora"
            Array={promoters}
            OnChange={onChangeEventPromoters}
          />
          {dataPost.event_promoter.length !== 0 ? (
            <Parrafo Value={dataPost.event_promoter} Margin="5px" />
          ) : null}

          <SelectBlack
            Option="Selecciona un Line Up"
            Array={djs}
            OnChange={onChangeEventDjs}
          />
          {dataPost.event_djs.length !== 0 ? (
            <Parrafo Value={dataPost.event_djs} Margin="5px" />
          ) : null}

          <SelectBlack
            Option="Selecciona un Genero Musical"
            Array={types}
            OnChange={onChangeEventType}
          />
          {dataPost.event_type.length !== 0 ? (
            <Parrafo Value={dataPost.event_type} Margin="5px" />
          ) : null}

          <InputBlack
            OnChange={onChangeDataInput}
            Name="ticket_link"
            Value={dataPost.ticket_link}
            Placeholder="Link de venta"
          />
          <InputBlack
            OnChange={onChangeDataInput}
            Name="event_date"
            Value={dataPost.event_date}
            Placeholder="Fecha del evento"
          />
          <InputBlack
            OnChange={onChangeDataInput}
            Name="event_location"
            Value={dataPost.event_location}
            Placeholder="Nombre del complejo o direccion"
          />
          <InputBlack
            OnChange={onChangeDataInput}
            Name="event_title"
            Value={dataPost.event_title}
            Placeholder="Nombre del evento"
          />

          {!loader ? (
            <div className={styles.inputFileContainer}>
              <label>Seleciona una imagen:</label>
              <input Type="file" onChange={handleFileChange} />
            </div>
          ) : (
            <div className={styles.inputFileContainer}>
              <Loader Color="#7c16f5" Height="30px" Width="30px" />
            </div>
          )}

          <ButtonBlue Value="Submit" OnClick={onSubmit} />
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.body}>
        <Loader Color="#7c16f5" Height="100px" Width="100px" />
      </div>
    );
  }
}

export default CreateFormPage;
