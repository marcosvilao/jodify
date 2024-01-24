import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./createEventPage.module.css";
import SelectBlack from "../../components2/selectBlack/selectBlack";
import ButtonBlue from "../../components2/buttonBlue/buttonBlue";
import ButtonBlack from "../../components2/buttonBlack/buttonBlack";
import axios from "axios";
import Loader from "../../components2/loader/loader";
import Alert from "../../components2/alert/alert";
import EventCard from "../../components2/eventCard/eventCard";
import InputFile from "../../components2/inputFile/inputFile";
import DatePicker from "../../components2/datePicker/datePicker";
import InputOutlined from "../../components2/inputOutlined/inputOulined";

function CreateEventPage() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const cloudinayUrl = process.env.REACT_APP_CLOUDINARY_URL + "/image/upload";
  const [pages, setPages] = useState(1);
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

    const changePages = () => {
      if (pages === 1) {
        setPages(2);
        window.scroll(0, 0);
      } else {
        setPages(1);
        window.scroll(0, 0);
      }
    };

    const cleanEvent = () => {
      window.location.reload();
    };

    return (
      <div className={styles.body}>
        {pages === 1 ? (
          <div className={styles.form}>
            <div style={{ width: "100%", textAlign: "center" }}>
              <h1>Publica tu evento</h1>
            </div>

            <h3>Previsualización</h3>

            <div className={styles.containerCard}>
              <EventCard
                Alt="Seleccionar Imagen"
                Img={dataPost.event_image}
                Tittle={dataPost.event_title}
                Location={dataPost.event_location}
                Genre={dataCardType}
                OnClick={onClickEventCard}
              />
            </div>

            <InputOutlined
              OnChange={onChangeDataInput}
              Name="event_location"
              Value={dataPost.event_location}
              Placeholder="ej. Av. Libertador 2647"
              Label="Nombre del complejo o direccion"
              Error=""
              Margin="50px 0px 0px 0px"
            />
            <p>Ingresa donde donde sera el evento.</p>

            <SelectBlack
              Option="Lugar del evento"
              Array={cities}
              OnChange={onChangeEventCity}
              Multiple={false}
              Margin="50px 0px 0px 0px"
            />
            <p>Ingresá la provincia o localidad donde sera el evento</p>

            <DatePicker
              OnChange={onChangeEventDate}
              Label="Fecha el evento"
              Margin="40px 0px 0px 0px"
            />

            {!loader ? (
              <InputFile
                OnClick={handleFileChange}
                File={dataPost.event_image}
                Margin="40px 0px 0px 0px"
              />
            ) : (
              <Loader Color="#7c16f5" Height="30px" Width="30px" />
            )}

            <div className={styles.containerButton}>
              <ButtonBlack Value="Limpiar" OnClick={cleanEvent} />
              <ButtonBlue Value="Siguiente" OnClick={changePages} />
            </div>
          </div>
        ) : (
          <div className={styles.form}>
            <div style={{ width: "100%", textAlign: "center" }}>
              <h1>Publica tu evento:</h1>
            </div>

            <h3>Previsualización</h3>

            <div className={styles.containerCard}>
              <EventCard
                Alt="Seleccionar Imagen"
                Img={dataPost.event_image}
                Tittle={dataPost.event_title}
                Location={dataPost.event_location}
                Genre={dataCardType}
                OnClick={onClickEventCard}
              />
            </div>

            <InputOutlined
              OnChange={onChangeDataInput}
              Name="ticket_link"
              Value={dataPost.ticket_link}
              Placeholder="ej. www.jodify.com.ar"
              Label="Enlace de venta del evento"
              Error=""
              Margin="50px 0px 0px 0px"
            />
            <p>
              Copiá y pegá el enlace donde los asistentes irán a comprar la
              entrada.
            </p>

            <SelectBlack
              Option="Ingresá el line up del evento"
              Array={djs}
              OnChange={onChangeEventDjs}
              Margin="50px 0px 0px 0px"
              Multiple={false}
            />

            <SelectBlack
              Option="Ingresá los géneros musicales del evento"
              Array={types}
              OnChange={onChangeEventType}
              Margin="50px 0px 0px 0px"
              Multiple={false}
            />

            <InputOutlined
              OnChange={onChangeDataInput}
              Margin="50px 0px 0px 0px"
              Name="event_title"
              Value={dataPost.event_title}
              Placeholder="ej. Jodify Winter Fest"
              Label="Nombre del evento"
              Error=""
            />
            <p>Si lo deseas, puedes personalizar aqui el nombre del evento.</p>

            <SelectBlack
              Option="Selecciona una Productora"
              Array={promoters}
              OnChange={onChangeEventPromoters}
              Margin="50px 0px 0px 0px"
            />

            <div className={styles.containerButton}>
              <ButtonBlack Value="Voler" OnClick={changePages} />
              <ButtonBlue Value="Publicar" OnClick={onSubmit} />
            </div>
          </div>
        )}
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