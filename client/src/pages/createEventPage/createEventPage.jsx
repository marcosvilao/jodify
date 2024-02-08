import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./createEventPage.module.css";
import SelectBlack from "../../components2/selectBlack/selectBlack";
import Button from "../../components2/button/button";
import axios from "axios";
import Loader from "../../components2/loader/loader";
import Alert from "../../components2/alert/alert";
import EventCard from "../../components2/eventCard/eventCard";
import InputFile from "../../components2/inputFile/inputFile";
import DatePicker from "../../components2/datePicker/datePicker";
import InputOutlined from "../../components2/inputBlack/inputBlack";
import { useNavigate } from "react-router-dom";

function CreateEventPage() {
  const history = useNavigate();
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const cloudinayUrl = process.env.REACT_APP_CLOUDINARY_URL + "/image/upload";
  const [loader, setLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [filterCities, setFilterCities] = useState(false);
  const [cities, setCities] = useState(false);
  const [types, setTypes] = useState(false);
  const [djs, setDjs] = useState(false);
  const [dataCardType, setDataCardType] = useState("");
  const [errorEnlace, setErrorEnlace] = useState("");
  const [errorDireccion, setErrorDireccion] = useState("");
  const [errorLineUp, setErrorLineUp] = useState("");
  const [errorPlace, setErrorPlace] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const [errorGeneros, setErrorGeneros] = useState("");
  const [errorFile, setErrorFile] = useState("");
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
    if (!cities) {
      axios
        .get(axiosUrl + "/cities")
        .then((res) => {
          const arrayCities = [];
          res.data.map((citie) => {
            arrayCities.push({ value: citie.city_name });
          });
          setCities(arrayCities);
          setFilterCities(res.data);
        })
        .catch(() => {
          Alert("Error!", "Error interno del servidor", "error");
        });
    }

    if (!types) {
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

  if (cities && types && djs) {
    const onChangeEventCity = (event, value) => {
      setErrorPlace("");
      if (typeof value === "string") {
        if (value) {
          let newCitie = filterCities.filter((citie) => {
            if (citie.city_name === value) {
              return {
                id: citie.id,
                name: citie.city_name,
              };
            }
          });

          setDataPost({
            ...dataPost,
            event_city: newCitie[0],
          });
        } else {
          setDataPost({
            ...dataPost,
            event_city: "",
          });
        }
      } else {
        if (value) {
          let newCitie = filterCities.filter((citie) => {
            if (citie.city_name === value.value) {
              return {
                id: citie.id,
                name: citie.city_name,
              };
            }
          });

          setDataPost({
            ...dataPost,
            event_city: newCitie[0],
          });
        } else {
          setDataPost({
            ...dataPost,
            event_city: "",
          });
        }
      }
    };

    const onChangeEventType = (event, value) => {
      let valoresConcatenados = "";
      let arrayTypes = [];
      for (let i = 0; i < value.length; i++) {
        if (value[i].value) {
          arrayTypes.push(value[i].value);
          if (value.length === 1) {
            valoresConcatenados += value[i].value;
          } else {
            valoresConcatenados += `${value[i].value} | `;
          }
        } else {
          arrayTypes.push(value[i]);
          if (value.length === 1) {
            valoresConcatenados += value[i];
          } else {
            valoresConcatenados += `${value[i]} | `;
          }
        }
      }
      setDataCardType(valoresConcatenados);
      setErrorGeneros("");
      setDataPost({
        ...dataPost,
        event_type: arrayTypes,
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
      let string = arrayDjs.join(" | ");
      setErrorLineUp("");
      setDataPost({
        ...dataPost,
        event_djs: arrayDjs,
        event_title: string,
      });
    };

    const onChangeEventDate = (event) => {
      setErrorFecha("");
      const formattedDate = dayjs(event).format("YYYY-MM-DD");
      setDataPost({
        ...dataPost,
        event_date: formattedDate,
      });
    };

    const onChangeDataInput = (e) => {
      if (e.target.name === "ticket_link" && errorEnlace) {
        setErrorEnlace("");
      }

      if (e.target.name === "event_location" && errorDireccion) {
        setErrorDireccion("");
      }

      setDataPost({
        ...dataPost,
        [e.target.name]: e.target.value,
      });
    };

    const onSubmit = () => {
      setSubmitLoader(true);
      if (
        dataPost.event_type.length === 0 ||
        dataPost.event_date.length === 0 ||
        dataPost.event_location.length === 0 ||
        dataPost.ticket_link.length === 0 ||
        dataPost.event_image.length === 0 ||
        dataPost.event_djs.length === 0 ||
        dataPost.event_city.length === 0
      ) {
        Alert("Error!", "Completar todos los campos", "error");
        setSubmitLoader(false);
        if (dataPost.event_location.length === 0) {
          setErrorDireccion("Completar campo");
        }

        if (dataPost.ticket_link.length === 0) {
          setErrorEnlace("Completar campo");
        }

        if (dataPost.event_city.length === 0) {
          setErrorPlace("Completar campo");
        }

        if (dataPost.event_djs.length === 0) {
          setErrorLineUp("Completar campo");
        }

        if (dataPost.event_type.length === 0) {
          setErrorGeneros("Completar campo");
        }

        if (dataPost.event_date.length === 0) {
          setErrorFecha("Completar campo");
        }

        if (dataPost.event_image.length === 0) {
          setErrorFile("Completar campo");
        }
      } else {
        axios
          .post(axiosUrl + "/events", { event: dataPost })
          .then(() => {
            setSubmitLoader(false);
            const formOne = document.getElementById("from-1");
            const formTwo = document.getElementById("from-2");
            const alert = document.getElementById("alert");

            formOne.style.display = "none";
            formTwo.style.display = "none";
            alert.style.display = "block";
          })
          .catch((err) => {
            Alert("Error!", err.response.data.message, "error");
            setSubmitLoader(false);
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
          fetch(cloudinayUrl, {
            method: "post",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              const secureUrl = data.url
                ? data.url.replace(/^http:/, "https:")
                : data.url;
              setDataPost((dataPost) => ({
                ...dataPost,
                event_image: secureUrl,
              }));
              setLoader(false);
              setErrorFile("");
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
        let fullUrl;
        if (dataPost.ticket_link.startsWith("https://")) {
          fullUrl = dataPost.ticket_link;
        } else {
          const baseUrl = "http://";
          fullUrl = baseUrl + dataPost.ticket_link;
        }
        window.open(fullUrl, "_blank");
      }
    };

    const changePages = () => {
      if (
        dataPost.event_date.length === 0 ||
        dataPost.event_location.length === 0 ||
        dataPost.event_image.length === 0 ||
        dataPost.event_city.length === 0
      ) {
        Alert("Error!", "Completar todos los campos", "error");
        setSubmitLoader(false);
        if (dataPost.event_location.length === 0) {
          setErrorDireccion("Completar campo");
        }

        if (dataPost.event_city.length === 0) {
          setErrorPlace("Completar campo");
        }

        if (dataPost.event_date.length === 0) {
          setErrorFecha("Completar campo");
        }

        if (dataPost.event_image.length === 0) {
          setErrorFile("Completar campo");
        }
      } else {
        const formOne = document.getElementById("from-1");
        const formTwo = document.getElementById("from-2");

        formOne.style.display = "none";
        formTwo.style.display = "flex";
      }
    };

    const changePages2 = () => {
      const formOne = document.getElementById("from-1");
      const formTwo = document.getElementById("from-2");

      formOne.style.display = "flex";
      formTwo.style.display = "none";
    };

    const cleanEvent = () => {
      window.location.reload();
    };

    let onClickRouteHome = () => {
      history("/");
      window.scroll(0, 0);
    };

    return (
      <div className={styles.body}>
        <div className={styles.form} id="from-1">
          <div style={{ width: "100%", textAlign: "center" }}>
            <h1>Publica tu evento</h1>
          </div>

          <div className={styles.containerPage}>
            <div className={styles.linePageContainer}>
              <div
                className={styles.cirule}
                style={{ backgroundColor: "#AE71F9" }}
              ></div>

              <div className={styles.linePage}></div>

              <div
                className={styles.cirule}
                style={{ backgroundColor: "#ffffff" }}
              ></div>
            </div>

            <div className={styles.containerNumbers}>
              <p className={styles.numberLeft} style={{ color: "#AE71F9" }}>
                1
              </p>
              <p className={styles.numberRight}>2</p>
            </div>
          </div>

          <h3 className={styles.formH3}>Previsualización</h3>

          <div className={styles.containerCard}>
            <EventCard
              Img={dataPost.event_image}
              SecondTittle={dataPost.event_title}
              Tittle={dataPost.event_djs}
              Location={dataPost.event_location}
              Genre={dataCardType}
              OnClick={onClickEventCard}
              Color="#AE71F9"
            />
          </div>

          <SelectBlack
            Option="Lugar del evento"
            Array={cities}
            OnChange={onChangeEventCity}
            Margin="32px 0px 0px 0px"
            Multiple={false}
            Error={errorPlace}
          />
          <p>Elegi la ciudad o porvincia donde queres que figure el evento.</p>

          <InputOutlined
            OnChange={onChangeDataInput}
            Name="event_location"
            Value={dataPost.event_location}
            Placeholder="ej. Av. Libertador 2647 (Palermo)"
            Label="Nombre del complejo o dirección"
            Error={errorDireccion}
            Margin="32px 0px 0px 0px"
            Variant="outlined"
          />
          <p>
            Ingresa el barrio o localidad entre parentesis ej. Crobar (Palermo)
          </p>

          <DatePicker
            OnChange={onChangeEventDate}
            Label="Fecha el evento"
            Margin="32px 0px 0px 0px"
            Error={errorFecha}
          />

          {!loader ? (
            <InputFile
              OnClick={handleFileChange}
              File={dataPost.event_image}
              Margin="32px 0px 0px 0px"
              Error={errorFile}
            />
          ) : (
            <div
              style={{
                width: "100%",
                textAlign: "center",
                marginTop: "40px",
              }}
            >
              <Loader Color="#7c16f5" Height="30px" Width="30px" />
            </div>
          )}

          <div className={styles.containerButton}>
            <Button
              Value="Limpiar"
              OnClick={cleanEvent}
              Color="#000000"
              Hover="#1B1C20"
            />
            <Button Value="Siguiente" OnClick={changePages} />
          </div>
        </div>

        <div className={styles.form} id="from-2" style={{ display: "none" }}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <h1>Publica tu evento:</h1>
          </div>

          <div className={styles.containerPage}>
            <div className={styles.linePageContainer}>
              <div
                className={styles.cirule}
                style={{ backgroundColor: "#AE71F9" }}
              ></div>

              <div
                className={styles.linePage}
                style={{ backgroundColor: "#AE71F9" }}
              ></div>

              <div
                className={styles.cirule}
                style={{ backgroundColor: "#AE71F9" }}
              ></div>
            </div>

            <div className={styles.containerNumbers}>
              <p className={styles.numberLeft} style={{ color: "#AE71F9" }}>
                1
              </p>
              <p className={styles.numberRight} style={{ color: "#AE71F9" }}>
                2
              </p>
            </div>
          </div>

          <h3 className={styles.formH3}>Previsualización</h3>

          <div className={styles.containerCard}>
            <EventCard
              Img={dataPost.event_image}
              SecondTittle={dataPost.event_title}
              Tittle={dataPost.event_djs}
              Location={dataPost.event_location}
              Genre={dataCardType}
              OnClick={onClickEventCard}
              Color="#AE71F9"
            />
          </div>

          <InputOutlined
            OnChange={onChangeDataInput}
            Name="ticket_link"
            Value={dataPost.ticket_link}
            Placeholder="ej. www.jodify.com.ar"
            Label="Enlace de venta del evento"
            Error={errorEnlace}
            Margin="32px 0px 0px 0px"
            Variant="outlined"
          />
          <p>
            Copiá y pegá el enlace donde los usuarios irán a comprar la entrada.
          </p>

          <SelectBlack
            Option="Ingresá el line up del evento"
            Array={djs}
            OnChange={onChangeEventDjs}
            Margin="32px 0px 0px 0px"
            Error={errorLineUp}
          />

          <SelectBlack
            Option="Ingresá los géneros musicales del evento"
            Array={types}
            OnChange={onChangeEventType}
            Margin="32px 0px 0px 0px"
            Error={errorGeneros}
          />

          <InputOutlined
            OnChange={onChangeDataInput}
            Name="event_title"
            Value={dataPost.event_title}
            Placeholder="ej. Jodify Winter Fest"
            Label="Nombre del evento"
            Error=""
            Margin="32px 0px 0px 0px"
            Requiere="false"
            Variant="outlined"
          />
          <p>Si lo deseas, puedes personalizar aqui el nombre del evento.</p>

          <div className={styles.containerButton}>
            <Button
              Value="Voler"
              OnClick={changePages2}
              Color="#000000"
              Hover="#1B1C20"
            />
            {!submitLoader ? (
              <Button Value="Publicar" OnClick={onSubmit} />
            ) : (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Loader Color="#7c16f5" Height="30px" Width="30px" />
              </div>
            )}
          </div>
        </div>

        <div className={styles.alert} id="alert">
          <h1>Jodify</h1>

          <h2>¡Tu evento se publicó correctamente!</h2>

          <p>Gracias por elegir Jodify</p>

          <div className={styles.containerButton}>
            <Button
              Value="Ir a Jodify"
              OnClick={onClickRouteHome}
              Color="#000000"
              Hover="#1B1C20"
            />
            <Button Value="Publicar otro evento" OnClick={cleanEvent} />
          </div>
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
