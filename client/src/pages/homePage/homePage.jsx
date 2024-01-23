import React, { useState, useEffect } from "react";
import styles from "./homePage.module.css";
import axios from "axios";
import Loader from "../../components2/loader/loader";
import InputSearch from "../../components2/inputSearch/inputSearch";
import DateRange from "../../components2/dateRange/dateRange";
import ButtonPicker from "../../components2/buttonPicker/buttonPicker";
import ButtonPickerSelected from "../../components2/buttonPickerSelected/buttonPickerSelected";
import EventCard from "../../components2/eventCard/eventCard";
import CheckBoxList from "../../components2/checkBoxList/checkBoxList";
import Alert from "../../components2/alert/alert";

function HomePage() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const [loader, setLoader] = useState(false);
  const [dataEventCard, setDataEventCard] = useState(false);
  const [openUbicacion, setOpenUbicacion] = useState(false);
  const [openGenero, setOpenGenero] = useState(false);
  const [openFecha, setOpenFecha] = useState(false);
  const [types, setType] = useState(false);
  const [cities, setCities] = useState(false);
  const [closePropsUbicacion, setClosePropsUbicacion] = useState(false);
  const [axiosCitie, setAxiosCitie] = useState(false);
  const [axiosType, setAxiosType] = useState(false);
  const [axiosFecha, setAxiosFecha] = useState(false);
  const [axiosSearch, setAxiosSearch] = useState(false);
  const [valueButtonFecha, setValueButtonFecha] = useState(false);
  const [citieName, setCitieName] = useState("CABA | GBA");
  const [filter, setFilter] = useState({
    page: 0,
    cities: ["258fd495-92d3-4119-aa37-0d1c684a0237"],
    dates: [],
    type: [],
    search: "",
  });

  useEffect(() => {
    axios
      .post(`${axiosUrl}/events/filtersNew`, filter)
      .then((res) => {
        setDataEventCard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${axiosUrl}/cities`)
      .then((res) => {
        setCities(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${axiosUrl}/types `)
      .then((res) => {
        setType(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!dataEventCard || !types || !cities) {
    return (
      <div className={styles.bodyLoader}>
        <Loader Color="#7c16f5" Height="100px" Width="100px" />
      </div>
    );
  } else {
    const elementDivCard =
      dataEventCard &&
      dataEventCard.map((event, i) => {
        let dateString = Object.keys(event)[0];
        let date = new Date(dateString);
        date.setHours(date.getHours() + 3);
        let options = {
          weekday: "long", // "Jueves"
          day: "numeric", // "24"
          month: "long", // "Agosto"
        };
        let formattedDate = date.toLocaleDateString("es-AR", options);
        let capitalizedDay =
          formattedDate.charAt(0).toUpperCase() +
          formattedDate.slice(1, formattedDate.indexOf(","));
        let capitalizedMonth =
          formattedDate
            .charAt(formattedDate.lastIndexOf(" ") + 1)
            .toUpperCase() +
          formattedDate.slice(formattedDate.lastIndexOf(" ") + 2);

        let finalFormattedDate = `${capitalizedDay}, ${formattedDate.slice(
          formattedDate.indexOf(" ") + 1,
          formattedDate.lastIndexOf(" ")
        )} ${capitalizedMonth}`;

        let objectName = Object.keys(dataEventCard[i])[0];

        const onClickEventCard = (clickedEvent) => {
          if (clickedEvent && clickedEvent.ticket_link) {
            window.open(clickedEvent.ticket_link, "_blank");
          }
        };

        return (
          <div key={i} className={styles.containerEventCard}>
            <h1>{finalFormattedDate}</h1>
            {event[objectName].map((event, index) => (
              <EventCard
                key={index}
                Img={event.event_image}
                Tittle={event.event_title}
                Location={event.event_location}
                Genre={event.event_type}
                OnClick={() => onClickEventCard(event)}
              />
            ))}
          </div>
        );
      });

    const onClickOpenFecha = () => {
      if (!openFecha) {
        setOpenFecha(true);
      } else {
        setOpenFecha(false);
      }
    };

    const onChangeDateRange = (value) => {
      if (value[0] === null && value[1] === null) {
        setFilter(() => ({
          ...filter,
          dates: [],
        }));
      } else if (value[1] === null) {
        let arrayDates = [value[0].$d, value[0].$d];
        let arraySetHoures = [];
        arrayDates.map((fecha) => {
          arraySetHoures.push(new Date(fecha.setHours(9, 0, 0)));
        });
        setFilter(() => ({
          ...filter,
          dates: arraySetHoures,
        }));
      } else if (value[1] !== null) {
        let arrayDates = [value[0].$d, value[1].$d];
        let arraySetHoures = [];
        arrayDates.map((fecha) => {
          arraySetHoures.push(new Date(fecha.setHours(9, 0, 0)));
        });
        setFilter(() => ({
          ...filter,
          dates: arraySetHoures,
        }));
      } else {
        return null;
      }
    };

    const onClickDateRange = () => {
      if (filter.dates.length === 0) {
        return null;
      }

      let fechaOriginal = filter.dates[0];
      let fecha = new Date(fechaOriginal);
      let dia = fecha.getDate();
      let mes = fecha.getMonth() + 1;
      dia = dia < 10 ? "0" + dia : dia;
      mes = mes < 10 ? "0" + mes : mes;
      let fechaFormateada = dia + "/" + mes;

      let fechaOriginal2 = filter.dates[1];
      let fecha2 = new Date(fechaOriginal2);
      let dia2 = fecha2.getDate();
      let mes2 = fecha2.getMonth() + 1;
      dia2 = dia2 < 10 ? "0" + dia2 : dia2;
      mes2 = mes2 < 10 ? "0" + mes2 : mes2;
      let fechaFormateada2 = dia2 + "/" + mes2;

      console.log(fechaFormateada);
      console.log(fechaFormateada2);

      if (fechaFormateada === fechaFormateada2) {
        console.log("iguales");
        setValueButtonFecha(fechaFormateada);
      } else {
        setValueButtonFecha(`${fechaFormateada} | ${fechaFormateada2}`);
      }

      setLoader(true);
      setOpenFecha(false);
      axios
        .post(`${axiosUrl}/events/filtersNew`, filter)
        .then((res) => {
          setDataEventCard(res.data);
          setLoader(false);
        })
        .catch(() => {
          Alert(
            "Error!",
            "Error al cargar los eventos por favor intentar luego mas tarde o ponerse en contacto con el servidor",
            "error"
          );
        });
    };

    const onCloseDateRange = () => {
      setOpenFecha(false);
    };

    const onCloseFecha = () => {
      if (filter.dates.length) {
        setFilter(() => ({
          ...filter,
          dates: [],
        }));
        if (openFecha) {
          setOpenFecha(false);
        }
        setValueButtonFecha(false);
        setLoader(true);
        setAxiosFecha(true);
      } else {
        setOpenFecha(false);
      }
    };

    const onClickOpenUbicaion = () => {
      if (!openUbicacion) {
        setOpenUbicacion(true);
        setClosePropsUbicacion(true);
      } else {
        setOpenUbicacion(false);
        setClosePropsUbicacion(false);
      }
    };

    const onClickCheckBoxListUbicacion = (item) => {
      setLoader(true);
      setAxiosCitie(true);
      setCitieName(item.city_name);
      setFilter(() => ({
        ...filter,
        cities: [item.id],
      }));
      onClickOpenUbicaion();
    };

    const onClickOpenGenero = () => {
      if (!openGenero) {
        setOpenGenero(true);
      } else {
        setOpenGenero(false);
      }
    };

    const onCloseTypes = () => {
      if (filter.type.length) {
        setFilter(() => ({
          ...filter,
          type: [],
        }));
        setLoader(true);
        setAxiosType(true);
        if (openGenero) {
          setOpenGenero(false);
        }
      } else {
        setOpenGenero(false);
      }
    };

    const onClickCheckBoxListGenero = (item) => {
      let arrayTypes = [];
      arrayTypes.push(item.type_name);

      setFilter(() => ({
        ...filter,
        type: arrayTypes,
      }));
      setLoader(true);
      setAxiosType(true);
      onClickOpenGenero();
    };

    const onChangeInputSearch = (e) => {
      setFilter(() => ({
        ...filter,
        search: e.target.value,
      }));
      setAxiosSearch(true);
      setLoader(true);
    };

    if (axiosType || axiosCitie || axiosFecha || axiosSearch) {
      axios
        .post(`${axiosUrl}/events/filtersNew`, filter)
        .then((res) => {
          setDataEventCard(res.data);
          setLoader(false);
          setAxiosType(false);
          setAxiosCitie(false);
          setAxiosFecha(false);
          setAxiosSearch(false);
        })
        .catch(() => {
          Alert(
            "Error!",
            "Error al cargar los eventos por favor intentar luego mas tarde o ponerse en contacto con el servidor",
            "error"
          );
        });
    }

    console.log(filter);

    return (
      <div className={styles.body}>
        <div className={styles.containerInput}>
          <InputSearch
            PlaceHolder="Buscá un evento, artista o club"
            OnChange={onChangeInputSearch}
          />

          <div className={styles.containerButtons}>
            <ButtonPickerSelected
              Value={citieName}
              OnClick={onClickOpenUbicaion}
              Close={closePropsUbicacion}
            />

            {openGenero || filter.type.length ? (
              <ButtonPickerSelected
                Value={filter.type.length ? filter.type[0] : "Género"}
                OnClick={onClickOpenGenero}
                Close="true"
                OnClose={onCloseTypes}
              />
            ) : (
              <ButtonPicker Value="Género" OnClick={onClickOpenGenero} />
            )}

            {openFecha || filter.dates.length ? (
              <ButtonPickerSelected
                Value={valueButtonFecha ? valueButtonFecha : "Fecha"}
                Close="true"
                OnClick={onClickOpenFecha}
                OnClose={onCloseFecha}
              />
            ) : (
              <ButtonPicker Value="Fecha" OnClick={onClickOpenFecha} />
            )}
          </div>

          <div className={styles.containerPicker}>
            {openUbicacion ? (
              <div className={styles.positionCitiesList}>
                <CheckBoxList
                  cityList={cities}
                  OnClick={onClickCheckBoxListUbicacion}
                />
              </div>
            ) : null}

            {openGenero ? (
              <div className={styles.positionTypesList}>
                <CheckBoxList
                  typeList={types}
                  OnClick={onClickCheckBoxListGenero}
                />
              </div>
            ) : null}

            {openFecha ? (
              <div className={styles.positionDatePicker}>
                <DateRange
                  OnChange={onChangeDateRange}
                  OnClick={onClickDateRange}
                  OnClose={onCloseDateRange}
                />
              </div>
            ) : null}
          </div>

          {dataEventCard.length === 0 && !loader ? (
            <div className={styles.noHayEventos}>
              <h1>No hay eventos en la fecha seleccionada</h1>
            </div>
          ) : null}

          {dataEventCard.length !== 0 && !loader ? (
            <div className={styles.containerEventCard}>{elementDivCard}</div>
          ) : null}

          {loader ? (
            <div className={styles.bodyLoader}>
              <Loader Color="#7c16f5" Height="100px" Width="100px" />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default HomePage;
