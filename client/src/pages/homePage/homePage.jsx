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
  const [loaderLazyLoad, setLoaderLazyLoad] = useState(false);
  const [dataEventCard, setDataEventCard] = useState(false);
  const [openUbicacion, setOpenUbicacion] = useState(false);
  const [openGenero, setOpenGenero] = useState(false);
  const [openFecha, setOpenFecha] = useState(false);
  const [types, setType] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [cities, setCities] = useState(false);
  const [axiosCitie, setAxiosCitie] = useState(false);
  const [axiosType, setAxiosType] = useState(false);
  const [axiosFecha, setAxiosFecha] = useState(false);
  const [axiosSearch, setAxiosSearch] = useState(false);
  const [lazyLoad, setLazyLoad] = useState(false);
  const [finishLazyLoad, setFinishLazyLoad] = useState(false);
  const [lazyLoadNoEvents, setLazyLoadNoEvents] = useState(false);
  const [valueButtonFecha, setValueButtonFecha] = useState(false);
  const [citieName, setCitieName] = useState("CABA | GBA");
  const [isFiltering, setIsFiltering] = useState(false);
  const [filter, setFilter] = useState({
    page: 0,
    cities: ["258fd495-92d3-4119-aa37-0d1c684a0237"],
    dates: [],
    types: [],
    search: "",
  });
  const [endReached, setEndReached] = useState(false);

  useEffect(() => {
    if (!dataEventCard) {
      axios
        .post(`${axiosUrl}/events/filtersNew`, filter)
        .then((res) => {
          setDataEventCard(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (!cities) {
      axios
        .get(`${axiosUrl}/cities`)
        .then((res) => {
          setCities(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (!types) {
      axios
        .get(`${axiosUrl}/types `)
        .then((res) => {
          setType(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (dataEventCard && !finishLazyLoad && !isFiltering && !loader) {
      async function handleScroll() {
        const maxHeight = document.body.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY || window.pageYOffset;

        if (
          currentScroll >= maxHeight &&
          dataEventCard &&
          !finishLazyLoad &&
          !isFiltering &&
          !loader
        ) {
          let page = filter.page + 1;
          setFilter(() => ({
            ...filter,
            page: page,
          }));
          setLazyLoad(true);
          setEndReached(true);
          setLoaderLazyLoad(true);
          setFinishLazyLoad(true);
        } else {
          setEndReached(false);
        }
      }

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [endReached, dataEventCard]);

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

        const additionalClass = i === 0 ? styles.firstElement : "";

        return (
          <div
            key={i}
            className={`${styles.containerEventCard} ${additionalClass}`}
          >
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
      setOpenGenero(false);
      setOpenUbicacion(false);
    };

    const onChangeDateRange = (value) => {
      setIsFiltering(true);
      setLazyLoadNoEvents(false);
      setLoaderLazyLoad(false);
      if (value[0] === null && value[1] === null) {
        setFilter(() => ({
          ...filter,
          dates: [],
          page: 0,
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
          page: 0,
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
          page: 0,
        }));
      } else {
        return null;
      }
    };

    const onClickDateRange = () => {
      setLazyLoadNoEvents(false);
      setLoaderLazyLoad(false);
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

      if (fechaFormateada === fechaFormateada2) {
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
          setFinishLazyLoad(false);
          setLazyLoadNoEvents(false);
          setIsFiltering(false);
          setLoaderLazyLoad(false);
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
          page: 0,
        }));
        if (openFecha) {
          setOpenFecha(false);
        }
        setValueButtonFecha(false);
        setLoader(true);
        setAxiosFecha(true);
        setIsFiltering(true);
        setLoaderLazyLoad(false);
        setLazyLoadNoEvents(false);
      } else {
        setOpenFecha(false);
      }
    };

    const onClickOpenUbicaion = () => {
      if (!openUbicacion) {
        setOpenUbicacion(true);
      } else {
        setOpenUbicacion(false);
      }
      setOpenFecha(false);
      setOpenGenero(false);
    };

    const onClickCheckBoxListUbicacion = (item) => {
      setLoader(true);
      setAxiosCitie(true);
      setLazyLoadNoEvents(false);
      setLoaderLazyLoad(false);
      setIsFiltering(true);
      setCitieName(item.city_name);
      setFilter(() => ({
        ...filter,
        cities: [item.id],
        page: 0,
      }));
      onClickOpenUbicaion();
    };

    const onClickOpenGenero = () => {
      if (!openGenero) {
        setOpenGenero(true);
      } else {
        setOpenGenero(false);
      }
      setOpenFecha(false);
      setOpenUbicacion(false);
    };

    const onCloseTypes = () => {
      if (filter.types.length) {
        setFilter(() => ({
          ...filter,
          types: [],
          page: 0,
        }));

        const resetCheckedItems = Object.keys(checkedItems).reduce(
          (acc, key) => {
            acc[key] = false;
            return acc;
          },
          {}
        );

        setCheckedItems(resetCheckedItems);

        setLoader(true);
        setAxiosType(true);
        setLazyLoadNoEvents(false);
        setIsFiltering(true);
        setLoaderLazyLoad(false);
        if (openGenero) {
          setOpenGenero(false);
        }
      } else {
        setOpenGenero(false);
      }
    };

    const onClickCheckBoxListGenero = (item) => {
      setCheckedItems((prevState) => ({
        ...prevState,
        [item.id]: !prevState[item.id],
      }));
      let arrayTypes = filter.types;

      if (arrayTypes.includes(item.type_name)) {
        arrayTypes = arrayTypes.filter((type) => type !== item.type_name);
        console.log(arrayTypes);
      } else {
        arrayTypes.push(item.type_name);
        console.log(arrayTypes);
      }

      setFilter(() => ({
        ...filter,
        types: arrayTypes,
        page: 0,
      }));
      setLoader(true);
      setAxiosType(true);
      setLazyLoadNoEvents(false);
      setIsFiltering(true);
      setLoaderLazyLoad(false);
    };

    const onCloseTypesList = () => {
      onClickOpenGenero();
    };

    const onChangeInputSearch = (e) => {
      setFilter(() => ({
        ...filter,
        search: e.target.value,
        page: 0,
      }));
      setAxiosSearch(true);
      setLazyLoadNoEvents(false);
      setLoader(true);
      setIsFiltering(true);
      setLoaderLazyLoad(false);
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
          setFinishLazyLoad(false);
          setLazyLoadNoEvents(false);
          setIsFiltering(false);
          setLoaderLazyLoad(false);
        })
        .catch(() => {
          Alert(
            "Error!",
            "Error al cargar los eventos por favor intentar luego mas tarde o ponerse en contacto con el servidor",
            "error"
          );
        });
    }

    if (lazyLoad) {
      axios
        .post(`${axiosUrl}/events/filtersNew`, filter)
        .then((res) => {
          setLoaderLazyLoad(false);
          setLazyLoad(false);

          if (res.data.length === 0) {
            setFinishLazyLoad(true);
            setLazyLoadNoEvents(true);
          } else {
            const newArray = [...dataEventCard];
            const dataCards = res.data;

            dataCards.forEach((newData) => {
              const newDate = Object.keys(newData)[0];
              const isDateInArray = newArray.some((existingData) => {
                const existingDate = Object.keys(existingData)[0];
                return existingDate === newDate;
              });

              if (isDateInArray) {
                newArray.forEach((existingData) => {
                  const existingDate = Object.keys(existingData)[0];
                  if (existingDate === newDate) {
                    existingData[newDate] = existingData[newDate].concat(
                      newData[newDate]
                    );
                  }
                });
              } else {
                newArray.push(newData);
              }
            });

            const uniqueArray = newArray.map((dateObj) => {
              const dateKey = Object.keys(dateObj)[0];
              const eventsArray = dateObj[dateKey];
              const uniqueEvents = [];
            
              eventsArray.forEach((event) => {
                if (!uniqueEvents.some((uniqueEvent) => uniqueEvent.id === event.id)) {
                  uniqueEvents.push(event);
                }
              });
            
              return { [dateKey]: uniqueEvents };
            });

            setDataEventCard(uniqueArray);
            setFinishLazyLoad(false);
          }
        })
        .catch((err) => {
          Alert(
            "Error!",
            "Error al cargar los eventos por favor intentar luego mas tarde o ponerse en contacto con el servidor",
            "error"
          );
        });
    }

    return (
      <div className={styles.body}>
        <div className={styles.containerFixed}>
          <div className={styles.containerInput}>
            <InputSearch
              PlaceHolder="Buscá un evento, artista o club"
              OnChange={onChangeInputSearch}
            />
          </div>
          <div className={styles.containerButtons}>
            <ButtonPickerSelected
              Value={citieName}
              OnClick={onClickOpenUbicaion}
            />

            {openGenero || filter.types.length ? (
              <ButtonPickerSelected
                Value={
                  filter.types.length > 1
                    ? filter.types[0] + " + " + (filter.types.length - 1)
                    : filter.types.length === 1
                    ? filter.types[0]
                    : "Género"
                }
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
        </div>

        <div className={styles.containerPicker}>
          {openUbicacion ? (
            <div>
              <CheckBoxList
                cityList={cities}
                OnClick={onClickCheckBoxListUbicacion}
                OnClose={onClickOpenUbicaion}
              />
            </div>
          ) : null}

          {openGenero ? (
            <div>
              <CheckBoxList
                typeList={types}
                checkedItems={checkedItems}
                OnClick={onClickCheckBoxListGenero}
                OnClose={onCloseTypesList}
                listType="city"
              />
            </div>
          ) : null}

          {openFecha ? (
            <div className={styles.datePicker}>
              <div className={styles.datePickerContainer}>
                <DateRange
                  OnChange={onChangeDateRange}
                  OnClick={onClickDateRange}
                  OnClose={onCloseDateRange}
                />
              </div>
            </div>
          ) : null}
        </div>

        {dataEventCard.length !== 0 && !loader ? (
          <div className={styles.containerEventCard}>{elementDivCard}</div>
        ) : null}

        {dataEventCard.length === 0 && !loader ? (
          <div className={styles.noHayEventos}>
            <h1>No hay eventos con el filtro seleccionado</h1>
          </div>
        ) : null}

        {loader ? (
          <div className={styles.bodyLoader}>
            <Loader Color="#7c16f5" Height="100px" Width="100px" />
          </div>
        ) : null}

        {loaderLazyLoad ? (
          <div className={styles.bodyLoaderLazyLoad}>
            <Loader Color="#7c16f5" Height="50px" Width="50px" />
          </div>
        ) : null}

        {lazyLoadNoEvents ? (
          <div className={styles.bodyLoaderLazyLoad}>
            <p>No hay mas eventos</p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default HomePage;
