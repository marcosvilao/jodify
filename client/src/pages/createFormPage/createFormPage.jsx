import React, { useState, useEffect } from "react";
import styles from "./createFormPage.module.css";
import axios from "axios";
import dayjs from "dayjs";
import Alert from "../../components2/alert/alert";
import EventCard from "../../components2/eventCard/eventCard";
import Loader from "../../components2/loader/loader";
import SelectBlack from "../../components2/selectBlack/selectBlack";
import Button from "../../components2/button/button";
import InputFile from "../../components2/inputFile/inputFile";
import DatePicker from "../../components2/datePicker/datePicker";
import InputOutlined from "../../components2/inputBlack/inputBlack";

function CreateFormPage() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const cloudinayUrl = process.env.REACT_APP_CLOUDINARY_URL + "/image/upload";
  const [loader, setLoader] = useState(false);
  const [loaderPupeteer, setLoaderPupeteer] = useState(false);
  const [datePupeteer, setDatePupeteer] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [errorEnlace, setErrorEnlace] = useState("");
  const [errorDireccion, setErrorDireccion] = useState("");
  const [errorLineUp, setErrorLineUp] = useState("");
  const [errorPlace, setErrorPlace] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const [errorGeneros, setErrorGeneros] = useState("");
  const [errorFile, setErrorFile] = useState("");
  const [cities, setCities] = useState(false);
  const [filterCities, setFilterCities] = useState(false);
  const [types, setTypes] = useState(false);
  const [djs, setDjs] = useState(false);
  const [promoters, setPromoters] = useState(false);
  const [dataPromoters, setDataPromoters] = useState(false);
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

    if (!promoters) {
      axios
        .get(axiosUrl + "/promoters")
        .then((res) => {
          const arrayPromoters = [];
          res.data.map((promoter) => {
            arrayPromoters.push({ value: promoter.name });
          });
          setPromoters(arrayPromoters);
          setDataPromoters(res.data);
        })
        .catch(() => {
          Alert("Error!", "Error interno del servidor", "error");
        });
    }
  }, []);

  if (cities && types && djs && promoters) {
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
          if (newCitie[0]) {
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

          if (newCitie[0]) {
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
      var valueInput = e.target.value;

      if (e.target.name === "ticket_link" && errorEnlace) {
        setErrorEnlace("");
      }

      if (e.target.name === "event_location" && errorDireccion) {
        setErrorDireccion("");
      }

      setDataPost({
        ...dataPost,
        [e.target.name]: valueInput,
      });
    };

    const onChangeDataInput2 = (e) => {
      var valueInput = e.target.value;

      if (e.target.name === "ticket_link" && errorEnlace) {
        setErrorEnlace("");
      }

      if (e.target.name === "event_location" && errorDireccion) {
        setErrorDireccion("");
      }

      if (e.target.name === "ticket_link") {
        setLoaderPupeteer(true);
        axios
          .post(axiosUrl + "/get-event-data", {
            link: valueInput,
          })
          .then((res) => {
            if (valueInput.includes("passline")) {
              setDatePupeteer(res.data.date);
              setDataPost({
                ...dataPost,
                event_location: res.data.location,
                event_image: res.data.image,
                ticket_link: valueInput,
                event_date: res.data.date,
                event_title: res.data.tittle,
              });
              setLoaderPupeteer(false);
            } else if (valueInput.includes("venti")) {
              setDatePupeteer(res.data.date);
              setDataPost({
                ...dataPost,
                event_location: res.data.location,
                event_image: res.data.image,
                ticket_link: valueInput,
                event_date: res.data.date,
                event_title: res.data.tittle,
              });
              setLoaderPupeteer(false);
            } else {
              Alert("Error!", "Error en el link proporcionado", "error");
              setLoaderPupeteer(false);
              setDataPost({
                ...dataPost,
                event_location: "",
                event_image: "",
                event_title: "",
                ticket_link: valueInput,
              });
            }
          })
          .catch((err) => {
            Alert("Error!", err, "error");
            setLoaderPupeteer(false);
            setDataPost({
              ...dataPost,
              event_location: "",
              event_image: "",
              event_title: "",
              ticket_link: valueInput,
            });
          });
      } else {
        setDataPost({
          ...dataPost,
          [e.target.name]: valueInput,
        });
      }
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
            let callbackAlert = () => {
              window.location.reload();
            };
            Alert(
              "Success!",
              "Evento creado correctamente!",
              "success",
              callbackAlert
            );
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
                "Error en la carga de la imagen, internar nuevamente o ponerse en contaco con el servidor",
                "error"
              );
              setLoader(false);
            });
        } else {
          Alert("Error!", "Selected file is not an image", "error");
          setLoader(false);
        }
      }
    };

    const onChangeEventPromoters = (event, value) => {
      let idPromoters = [];

      if (value.length) {
        for (let i = 0; i < value.length; i++) {
          for (let j = 0; j < dataPromoters.length; j++) {
            if (
              dataPromoters[j].name === value[i].value ||
              dataPromoters[j].name === value[i]
            ) {
              idPromoters.push({
                id: dataPromoters[j].id,
              });
            }
          }
        }
      }

      setDataPost({
        ...dataPost,
        event_promoter: idPromoters,
      });
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

    const renameEvent = () => {
      setDataPost({
        ...dataPost,
        event_title: dataPost.event_djs,
      });
    };

    return (
      <div className={styles.body}>
        <div className={styles.form}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <h1>Crea tu evento</h1>
          </div>

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
            OnChange={onChangeDataInput2}
            Name="ticket_link"
            Placeholder="ej. https://www.passline.com / https://venti.com.ar"
            Label="Scrapping"
            Margin="32px 0px 0px 0px"
            Variant="outlined"
          />
          <p>Scrapping solo usar links de passline o venti</p>

          {!loaderPupeteer ? (
            <div>
              <InputOutlined
                OnChange={onChangeDataInput}
                Name="ticket_link"
                Placeholder="ej. www.jodify.com.ar"
                Label="Link de venta"
                Error={errorEnlace}
                Margin="32px 0px 0px 0px"
                Variant="outlined"
                Value={dataPost.ticket_link}
              />
              <p>Copiá y pegá aca el link de venta de entradas</p>
            </div>
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

          {!loader && !loaderPupeteer ? (
            <div
              style={{
                width: "100%",
              }}
            >
              <InputFile
                OnClick={handleFileChange}
                File={dataPost.event_image}
                Margin="32px 0px 0px 0px"
                Error={errorFile}
              />
              <InputOutlined
                OnChange={onChangeDataInput}
                Name="event_image"
                Value={dataPost.event_image}
                Placeholder="https://res.cloudinary.com/dqc865z8r/image/upload/v1706719017/lxfzhxfzenjfp"
                Label="Url imagen"
                Error={errorDireccion}
                Margin="3px 0px 0px 0px"
                Variant="outlined"
              />
              <p>Carga la imagen desde el archivo o pon la url en el input</p>
            </div>
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

          {!loaderPupeteer ? (
            <div>
              <DatePicker
                OnChange={onChangeEventDate}
                Label="Fecha el evento"
                Margin="32px 0px 0px 0px"
                Error={errorFecha}
                InitialDate={datePupeteer}
              />
              <p>Selecciona la fecha del evento</p>
            </div>
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

          {!loaderPupeteer ? (
            <div>
              <InputOutlined
                OnChange={onChangeDataInput}
                Name="event_location"
                Value={dataPost.event_location}
                Placeholder="ej. Av. Libertador 2647 (Beccar)"
                Label="Ubicacion"
                Error={errorDireccion}
                Margin="32px 0px 0px 0px"
                Variant="outlined"
              />
              <p>
                Escribi la direccion o nombre del lugar con la localidad entre
                parentesis
              </p>
            </div>
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

          <SelectBlack
            Option="Ciudad"
            Array={cities}
            OnChange={onChangeEventCity}
            Margin="32px 0px 0px 0px"
            Multiple={false}
            Error={errorPlace}
          />
          <p>Selecciona la ciudad donde figurara el evento</p>

          <SelectBlack
            Option="Productora"
            Array={promoters}
            OnChange={onChangeEventPromoters}
            Margin="32px 0px 0px 0px"
          />
          <p>Selecciona su productora</p>

          <SelectBlack
            Option="Line up"
            Array={djs}
            OnChange={onChangeEventDjs}
            Margin="32px 0px 0px 0px"
            Error={errorLineUp}
          />
          <p>Incluye los djs que tocaran</p>

          <SelectBlack
            Option="Géneros musicales"
            Array={types}
            OnChange={onChangeEventType}
            Margin="32px 0px 0px 0px"
            Error={errorGeneros}
          />
          <p>Selecciona los generon que habra</p>

          {!loaderPupeteer ? (
            <div>
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
              <p>Si lo deseas, puedes personalizar aqui el nombre del evento</p>
            </div>
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
              Value="Renombrar"
              OnClick={renameEvent}
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
