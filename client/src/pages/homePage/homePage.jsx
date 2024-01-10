import React, { useState, useEffect } from "react";
import styles from "./homePage.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import InputSearch from "../../components2/inputSearch/inputSearch";
import DatePicker from "../../components2/datePicker/datePicker";
import ButtonPicker from "../../components2/buttonPicker/buttonPicker";
import ButtonPickerSelected from "../../components2/buttonPickerSelected/buttonPickerSelected";
import EventCard from "../../components2/eventCard/eventCard";
import CheckBoxList from "../../components2/checkBoxList/checkBoxList";

function HomePage() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const [dataEventCard, setDataEventCard] = useState(false);
  const [openUbicacion, setOpenUbicacion] = useState(false);
  const [openGenero, setOpenGenero] = useState(false);
  const [openFecha, setOpenFecha] = useState(false);
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState([]);
  const [checkedTypes, setCheckedTypes] = useState([]);
  const [checkedCities, setCheckedCities] = useState([]);
  const [types, setType] = useState(false);
  const [cities, setCities] = useState(false);
  const [openDatesFilter, setOpenDatesFilter] = useState(false);
  const [filters, setfilters] = useState({
    types: [],
    cities: [],
    dates: [],
  });

  const onChangeInputSearch = (e) => {
    console.log("Hola");
  };

  useEffect(() => {
    axios
      .get(`${axiosUrl}/events`)
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
        <CircularProgress
          style={{ color: "#7c16f5", height: "100px", width: "100px" }}
        />
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

    return (
      <div className={styles.body}>
        <div className={styles.containerInput}>
          <InputSearch
            PlaceHolder="Buscá un evento, artista o club"
            OnChange={onChangeInputSearch}
          />
          <div className={styles.containerButtons}>
            {!openUbicacion ? (
              <ButtonPicker Value="Ubicación" />
            ) : (
              <ButtonPickerSelected Value="Ubicación" />
            )}
            {!openGenero ? (
              <ButtonPicker Value="Género" />
            ) : (
              <ButtonPickerSelected Value="Género" />
            )}
            {!openFecha ? (
              <ButtonPicker Value="Fecha" />
            ) : (
              <ButtonPickerSelected Value="Fecha" />
            )}
          </div>
          {null ? (
            <div className={styles.containerPicker}>
              <div className={styles.positionDatePicker}>
                <DatePicker
                  open={open}
                  setOpen={setOpen}
                  setIsOpen={setOpenDatesFilter}
                  setDateFilter={setDates}
                  setDefaultValues={filters.dates}
                />
              </div>

              <div className={styles.positionCitiesList}>
                <CheckBoxList
                  cityList={cities}
                  checkedItems={checkedCities}
                  setCheckedItems={setCheckedCities}
                />
              </div>

              <div>
                <CheckBoxList
                  typeList={types}
                  checkedItems={checkedTypes}
                  setCheckedItems={setCheckedTypes}
                />
              </div>
            </div>
          ) : null}

          <div className={styles.containerEventCard}>{elementDivCard}</div>
        </div>
      </div>
    );
  }
}

export default HomePage;
