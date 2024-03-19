import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./createEventPage.module.css";
import SelectMaterial from "../../components2/selectMaterial/selectMaterial";
import Button from "../../components2/ButtonCreateEvents/button";
import axios from "axios";
import Loader from "../../components2/loader/loader";
import Alert from "../../components2/alert/alert";
import EventCard from "../../components2/eventCard/eventCard";
import InputFile from "../../components2/inputFile/inputFile";
import DatePicker from "../../components2/datePicker/datePicker";
import InputOutlined from "../../components2/inputMaterial/inputMaterial";
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
    name: "",
    event_type: [],
    date_from: "",
    venue: "",
    ticket_link: "",
    image_url: "",
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
        date_from: formattedDate,
      });
    };

    const onChangeDataInput = (e) => {
      if (e.target.name === "ticket_link" && errorEnlace) {
        setErrorEnlace("");
      }

      if (e.target.name === "venue" && errorDireccion) {
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
        dataPost.date_from.length === 0 ||
        dataPost.venue.length === 0 ||
        dataPost.ticket_link.length === 0 ||
        dataPost.image_url.length === 0 ||
        dataPost.event_djs.length === 0 ||
        dataPost.event_city.length === 0
      ) {
        Alert("", "Completar todos los campos", "");
        setSubmitLoader(false);
        if (dataPost.venue.length === 0) {
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

        if (dataPost.date_from.length === 0) {
          setErrorFecha("Completar campo");
        }

        if (dataPost.image_url.length === 0) {
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
            alert.style.visibility = "visible";
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
                image_url: secureUrl,
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
              setDataPost((dataPost) => ({
                ...dataPost,
                image_url: "",
              }));
              setLoader(false);
            });
        } else {
          Alert("", "El archivo seleccionado no es una imagen", "");
          setDataPost((dataPost) => ({
            ...dataPost,
            image_url: "",
          }));
          setLoader(false);
        }
      }
    };

    const changePages = () => {
      if (
        dataPost.date_from.length === 0 ||
        dataPost.venue.length === 0 ||
        dataPost.image_url.length === 0 ||
        dataPost.event_city.length === 0
      ) {
        Alert("", "Completar todos los campos", "");
        setSubmitLoader(false);
        if (dataPost.venue.length === 0) {
          setErrorDireccion("Completar campo");
        }

        if (dataPost.event_city.length === 0) {
          setErrorPlace("Completar campo");
        }

        if (dataPost.date_from.length === 0) {
          setErrorFecha("Completar campo");
        }

        if (dataPost.image_url.length === 0) {
          setErrorFile("Completar campo");
        }
      } else {
        const formOne = document.getElementById("from-1");
        const formTwo = document.getElementById("from-2");

        formOne.style.display = "none";
        formTwo.style.display = "flex";

        window.scroll(0, 0);
      }
    };

    const changePages2 = () => {
      const formOne = document.getElementById("from-1");
      const formTwo = document.getElementById("from-2");

      formOne.style.display = "flex";
      formTwo.style.display = "none";

      window.scroll(0, 0);
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

          <SelectMaterial
            Option="Lugar del evento"
            Array={cities}
            OnChange={onChangeEventCity}
            Margin="32px 0px 0px 0px"
            Multiple={false}
            Error={errorPlace}
          />
          <p>Elije la ciudad o provincia donde queres que figure el evento</p>

          <InputOutlined
            OnChange={onChangeDataInput}
            Name="venue"
            Value={dataPost.venue}
            Placeholder="ej. Av. Libertador 2647 (Palermo)"
            Label="Nombre del complejo o dirección"
            Error={errorDireccion}
            Margin="32px 0px 0px 0px"
            Variant="outlined"
          />
          <p>
            Ingresá el lugar o la dirección del evento, incluir el barrio entre
            parentesis Ej, Crobar (Palermo)
          </p>

          <DatePicker
            OnChange={onChangeEventDate}
            Label="Fecha el evento"
            Margin="26px 0px 0px 0px"
            Error={errorFecha}
          />

          {!loader ? (
            <InputFile
              OnClick={handleFileChange}
              File={dataPost.image_url}
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

          <h3 className={styles.formH3}>Así se verá en nuestra cartelera!</h3>

          <div className={styles.containerCard}>
            <EventCard
              Img={dataPost.image_url}
              SecondTittle={dataPost.name}
              Tittle={dataPost.event_djs}
              Location={dataPost.venue}
              Genre={dataCardType}
              Color="#AE71F9"
              Link="Default"
            />
          </div>

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
            Copiá y pegá el enlace donde los asistentes irán a comprar la
            entrada
          </p>

          <SelectMaterial
            Option="Ingresá los géneros musicales del evento"
            Array={types}
            OnChange={onChangeEventType}
            Margin="32px 0px 0px 0px"
            Error={errorGeneros}
          />

          <SelectMaterial
            Option="Ingresá el line up del evento"
            Array={djs}
            OnChange={onChangeEventDjs}
            Margin="32px 0px 0px 0px"
            Error={errorLineUp}
          />
          <p>Selecciona los artistas que participan del evento</p>

          <h3 className={styles.formH3}>Previsualización</h3>

          <div className={styles.containerCard}>
            <EventCard
              Img={dataPost.image_url}
              SecondTittle={dataPost.name}
              Tittle={dataPost.event_djs}
              Location={dataPost.venue}
              Genre={dataCardType}
              Color="#AE71F9"
              Link="Default"
            />
          </div>

          <InputOutlined
            OnChange={onChangeDataInput}
            Name="name"
            Value={dataPost.name}
            Placeholder="ej. Jodify Winter Fest"
            Label="Nombre del evento"
            Error=""
            Margin="32px 0px 0px 0px"
            Requiere="false"
            Variant="outlined"
          />
          <p>
            Ponemos por defecto el line up como nombre del evento, pero puedes
            elegir editarlo acá
          </p>

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
          <div className={styles.containerAlert} id="alert">
            <img
              src="https://s3-alpha-sig.figma.com/img/b5ae/456f/01cfd0a1c2cb1ab5689f93e83cba870d?Expires=1708905600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GBUK-QsD9wQh-nRGbsB2LKLwvnFZeKRHLatZLFPWzw1387oDP3C8sXBZ1Wd1Ps6FFpyCzDS0fpi3nyMrD7PDay4kA2gxTJWawLhnR-1bkm-YJYHZPVu2NOMIri8DC-xZEduXyDOdSLCaivGRe9vXjI-kctrgBSgzZoxz4YpuV-o8DuyL7b6c-ldObbZLpGdMPm77MF33TUiC-qd~ugDJLeITP9wC80lsQ6ItMuSUB4s4b4k8bpgStgDANMp4VVyMObCxxa07wCEvkpNU2eCajfgpZTAyabej1MXgQH5gFvCShJA6B3j3AAALhySw0S~cBrutzpcvW29jkTkIKlp0JQ__"
              alt="Error al cargar el logo"
            />

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
