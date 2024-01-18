import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./createEventPage.module.css";
import SelectBlack from "../../components2/selectBlack/selectBlack";
import InputBlack from "../../components2/inputBlack/inputBlack";
import ButtonBlue from "../../components2/buttonBlue/buttonBlue";
import axios from "axios";
import Loader from "../../components2/loader/loader";
import Alert from "../../components2/alert/alert";
import EventCard from "../../components2/eventCard/eventCard";
import InputFile from "../../components2/inputFile/inputFile";
import DatePicker from "../../components2/datePicker/datePicker";

function CreateEventPage() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const cloudinayUrl = process.env.REACT_APP_CLOUDINARY_URL + "/image/upload";
  const [loader, setLoader] = useState(false);
  const [cities, setCities] = useState(false);
  const [types, setTypes] = useState(false);
  const [djs, setDjs] = useState(false);
  const [promoters, setPromoters] = useState(false);
  const [dataCardType, setDataCardType] = useState("");
  const [dataPost, setDataPost] = useState({
    event_title: "",
    event_type: [],
    event_date: "",
    event_location: "",
    ticket_link: "",
    event_image: "",
    event_djs: [],
    event_city: "",
    event_promoter: [],
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
    const onChangeEventCity = (event, value) => {
      if (value) {
        setDataPost({
          ...dataPost,
          event_city: value.value,
        });
      } else {
        setDataPost({
          ...dataPost,
          event_city: "",
        });
      }
    };

    const onChangeEventType = (event, value) => {
      let valoresConcatenados = "";
      for (let i = 0; i < value.length; i++) {
        if (value.length === 1) {
          valoresConcatenados += value[i].value;
        } else {
          valoresConcatenados += `${value[i].value} | `;
        }
      }
      setDataCardType(valoresConcatenados);
      setDataPost({
        ...dataPost,
        event_type: value,
      });
    };

    const onChangeEventPromoters = (event, value) => {
      setDataPost({
        ...dataPost,
        event_promoter: value,
      });
    };

    const onChangeEventDjs = (event, value) => {
      setDataPost({
        ...dataPost,
        event_djs: value,
      });
    };

    const onChangeEventDate = (event) => {
      const formattedDate = dayjs(event).format("YYYY-MM-DD");
      setDataPost({
        ...dataPost,
        event_date: formattedDate,
      });
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
          .post(axiosUrl + "/events", { event: dataPost })
          .then(() => {
            let callbackAlert = () => {
              window.location.reload();
            };
            Alert(
              "Success!",
              "Evento creado correctamente",
              "success",
              callbackAlert
            );
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
        if (file.type) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "jodify_key");
          formData.append("jodify", "");
          console.log(formData);
          fetch(cloudinayUrl, {
            method: "post",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              const secureUrl = data.url
                ? data.url.replace(/^http:/, "https:")
                : data.url;
              console.log(secureUrl);
              setDataPost((dataPost) => ({
                ...dataPost,
                event_image: secureUrl,
              }));
              setLoader(false);
            })
            .catch(() => {
              Alert(
                "Error!",
                "Error en la carga de la imagen, internar luego mas tarde o ponerse en contaco con el servidor",
                "error"
              );
            });
        } else {
          Alert("Error!", "Selected file is not an image", "error");
          setLoader(false);
        }
      }
    };

    const onClickEventCard = () => {
      if (dataPost.ticket_link === "") {
        Alert("Error!", "Completar el campo de Link de Venta", "error");
      } else {
        const baseUrl = "http://";
        const fullUrl = baseUrl + dataPost.ticket_link;
        window.open(fullUrl, "_blank");
      }
    };

    console.log(dataPost);

    return (
      <div className={styles.body}>
        <div className={styles.form}>
          <h1 style={{ color: "white" }}>Create Event</h1>

          <InputBlack
            OnChange={onChangeDataInput}
            Name="event_title"
            Value={dataPost.event_title}
            Placeholder="ej. Jodify Winter Fest"
            Label="Nombre del evento"
          />

          <InputBlack
            OnChange={onChangeDataInput}
            Name="event_location"
            Value={dataPost.event_location}
            Placeholder="ej. Av. Libertador 2647"
            Label="Nombre del complejo o direccion"
          />

          <InputBlack
            OnChange={onChangeDataInput}
            Name="ticket_link"
            Value={dataPost.ticket_link}
            Placeholder="ej. www.jodify.com.ar"
            Label="Link de venta"
          />

          <SelectBlack
            Option="Selecciona una Ciudad"
            Array={cities}
            OnChange={onChangeEventCity}
            Multiple={false}
          />

          <SelectBlack
            Option="Selecciona una Productora"
            Array={promoters}
            OnChange={onChangeEventPromoters}
          />

          <SelectBlack
            Option="Selecciona un Line Up"
            Array={djs}
            OnChange={onChangeEventDjs}
          />

          <SelectBlack
            Option="Selecciona un Genero Musical"
            Array={types}
            OnChange={onChangeEventType}
          />

          <DatePicker OnChange={onChangeEventDate} />

          {!loader ? (
            <InputFile OnClick={handleFileChange} File={dataPost.event_image} />
          ) : (
            <Loader Color="#7c16f5" Height="30px" Width="30px" />
          )}

          <ButtonBlue Value="Submit" OnClick={onSubmit} />
        </div>
        <div className={styles.containerEventCard}>
          <EventCard
            Alt="Seleccionar Imagen"
            Img={dataPost.event_image}
            Tittle={dataPost.event_title}
            Location={dataPost.event_location}
            Genre={dataCardType}
            OnClick={onClickEventCard}
          />
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

export default CreateEventPage;
