import React, { useState, useEffect, useRef } from "react";
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
import SkeletonLoader from "../../components2/loaderSkeleton/loaderSkeleton";
import Footer from "../../components2/footer/footer";
import LogoCompartir from "../../assets/Jodify-logo.png";
import { Helmet } from 'react-helmet';


function HomePage() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const headersRef = useRef([]);
  const [loader, setLoader] = useState(false);
  const [loaderLazyLoad, setLoaderLazyLoad] = useState(false);
  const [dataEventCard, setDataEventCard] = useState(false);
  const [openUbicacion, setOpenUbicacion] = useState(false);
  const [openGenero, setOpenGenero] = useState(false);
  const [openFecha, setOpenFecha] = useState(false);
  const [types, setType] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedItemsCities, setCheckedItemsCities] = useState({});
  const [cities, setCities] = useState(false);
  const [axiosCitie, setAxiosCitie] = useState(false);
  const [axiosType, setAxiosType] = useState(false);
  const [axiosFecha, setAxiosFecha] = useState(false);
  const [axiosSearch, setAxiosSearch] = useState(false);
  const [lazyLoad, setLazyLoad] = useState(false);
  const [finishLazyLoad, setFinishLazyLoad] = useState(false);
  const [lazyLoadNoEvents, setLazyLoadNoEvents] = useState(false);
  const [valueButtonFecha, setValueButtonFecha] = useState(false);
  const [citieName, setCitieName] = useState(["Ubicación"]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentEventForShare, setCurrentEventForShare] = useState({
    title: "Jodify",
    image: LogoCompartir,
    genre: "disfrutar es urgente",
});
  const [filter, setFilter] = useState({
    page: 0,
    cities: [],
    dates: [],
    types: [],
    search: "",
    sharedId: "",
  });
  const [endReached, setEndReached] = useState(false);

  useEffect(() => {
    if (!dataEventCard) {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedEventId = urlParams.get("sharedEventId");
      const eventDate = urlParams.get("eventDate");

      if (eventDate) {
        var eventDateSplit = eventDate.split("/");
        var eventDateJoin = eventDateSplit.join(" ");
        var sharedArrayDates = [eventDateJoin, eventDateJoin];

        var fechaOriginal = sharedArrayDates[0];
        var fecha = new Date(fechaOriginal);
        var dia = fecha.getDate();
        var mes = fecha.getMonth() + 1;
        dia = dia < 10 ? "0" + dia : dia;
        mes = mes < 10 ? "0" + mes : mes;
        var fechaFormateada = dia + "/" + mes;
      }

      axios
        .post(
          `${axiosUrl}/events/filtersNew`,
          sharedEventId
            ? {
                page: 0,
                cities: [],
                dates: sharedArrayDates,
                types: [],
                search: "",
                sharedId: sharedEventId,
              }
            : filter
        )
        .then((res) => {
          const sortArray = res.data;
          sortArray.forEach((dateInfo) => {
            Object.keys(dateInfo).forEach((date) => {
              dateInfo[date].sort((a, b) => {
                // Verificar primero si alguno de los eventos es el evento compartido y debe ir primero
                if (a.id === sharedEventId) return -1;
                if (b.id === sharedEventId) return 1;

                // Encuentra la prioridad más baja (mayor prioridad) en los promoters de 'a'
                const priorityA = a.promoters.reduce((min, promoter) => {
                  if (
                    promoter.priority !== null &&
                    (min === null || promoter.priority < min)
                  ) {
                    return promoter.priority;
                  }
                  return min;
                }, null);

                // Encuentra la prioridad más baja (mayor prioridad) en los promoters de 'b'
                const priorityB = b.promoters.reduce((min, promoter) => {
                  if (
                    promoter.priority !== null &&
                    (min === null || promoter.priority < min)
                  ) {
                    return promoter.priority;
                  }
                  return min;
                }, null);

                // Comparación para el ordenamiento, tratando null como infinito
                return (
                  (priorityA !== null ? priorityA : Infinity) -
                  (priorityB !== null ? priorityB : Infinity)
                );
              });
            });
          });
          if (sharedEventId) {
            setFilter({
              page: 0,
              cities: [],
              dates: sharedArrayDates,
              types: [],
              search: "",
              sharedId: sharedEventId,
            });
            setDataEventCard(sortArray);
            setValueButtonFecha(fechaFormateada);
          } else {
            setDataEventCard(sortArray);
          }
        })
        .catch(() => {
          Alert(
            "Error!",
            "Error al cargar los eventos, recargar la pagina o ponerse en contacto con el servidor",
            "error"
          );
        });
    }

    if (!cities) {
      axios
        .get(`${axiosUrl}/cities`)
        .then((res) => {
          setCities(res.data);
        })
        .catch(() => {
          Alert(
            "Error!",
            "Error al cargar los filtros, recargar la pagina o ponerse en contacto con el servidor",
            "error"
          );
        });
    }

    if (!types) {
      axios
        .get(`${axiosUrl}/types `)
        .then((res) => {
          setType(res.data);
        })
        .catch(() => {
          Alert(
            "Error!",
            "Error al cargar los filtros, recargar la pagina o ponerse en contacto con el servidor",
            "error"
          );
        });
    }

    if (dataEventCard && !finishLazyLoad && !isFiltering && !loader) {
      async function handleScroll() {
        const maxHeight = document.body.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY || window.pageYOffset;

        if (
          currentScroll >= maxHeight - 200 && // Cambio aquí, 20px antes del final
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
        formattedDate.charAt(formattedDate.lastIndexOf(" ") + 1).toUpperCase() +
        formattedDate.slice(formattedDate.lastIndexOf(" ") + 2);

      let finalFormattedDate = `${capitalizedDay}, ${formattedDate.slice(
        formattedDate.indexOf(" ") + 1,
        formattedDate.lastIndexOf(" ")
      )} ${capitalizedMonth}`;

      let objectName = Object.keys(dataEventCard[i])[0];

      const onClickEventCard = (event) => {
        axios
          .put(`${axiosUrl}/add-interaction/${event.id}`)
          .then((res) => {
            if (event.ticket_link && res.data) {
              setTimeout(() => {
                window.open(event.ticket_link, "_blank");
              }, 50);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      };

      const additionalClass = i === 0 ? styles.firstElement : "";

      const handleEventShare = (eventDetails) => {
        setCurrentEventForShare(eventDetails);
    };

      const onClickShare = async (event) => {
        // Tu fecha original
        const fechaOriginal = finalFormattedDate;

        // Extraemos el día y el mes
        const partes = fechaOriginal.split(", ");
        const dia = partes[1].split(" de ")[0]; // "5"
        const mesNombre = partes[1].split(" de ")[1]; // "Abril"

        // Convertimos el mes a su número correspondiente
        const meses = {
          Enero: 0,
          Febrero: 1,
          Marzo: 2,
          Abril: 3,
          Mayo: 4,
          Junio: 5,
          Julio: 6,
          Agosto: 7,
          Septiembre: 8,
          Octubre: 9,
          Noviembre: 10,
          Diciembre: 11,
        };

        const mes = meses[mesNombre];

        // Creamos un objeto Date con la fecha. Asumimos el año 2024.
        const fecha = new Date(2024, mes, dia, 9, 0, 0);

        // Para ajustar al huso horario de Argentina, puedes restar 3 horas,
        // pero esto depende de si necesitas considerar el horario de verano.
        // Esto es un ejemplo simple que no lo considera.
        fecha.setHours(fecha.getHours());

        // Convertimos a string. El formato exacto dependerá de la localización y configuración del entorno.
        const fechaString = fecha.toString();

        const fechaStringSplit = fechaString.split(" ");
        const fechaStringJoin = fechaStringSplit.join("/");

        try {


          const shareData = {
            // title: "Jodify",
            // text: "Plataforma para encontrar tu evento favorito",
            url: `${window.location.origin}/?sharedEventId=${event.id}&eventDate=${fechaStringJoin}`
          };

          if (navigator.share) {
            await navigator.share(shareData);
            console.log("Contenido compartido!");
          } else {
            console.log("Compartir no es soportado por este navegador.");
          }
        } catch (error) {
          console.log("Error al compartir:", error);
        }
      };

      return (
        <div
          key={i}
          className={`${styles.containerEventCard} ${additionalClass}`}
        >
          <Helmet>
                <title>{currentEventForShare.title}</title>
                <meta property="og:title" content={currentEventForShare.title} />
                <meta property="og:description" content={currentEventForShare.genre} />
                <meta property="og:image" content={currentEventForShare.image} />
            </Helmet>
          <h1
            ref={(el) => (headersRef.current[i] = el)}
            className={styles.stickyHeader}
          >
            {finalFormattedDate}
          </h1>
          {event[objectName].map((event, index) => (
            <div style={{ marginBottom: "12px" }}>
              <EventCard
                key={index}
                Tittle={event.djs}
                SecondTittle={event.name}
                Img={event.image_url}
                Location={event.venue}
                Genre={event.types}
                OnClick={() => onClickEventCard(event)}
                ID={event.id}
                Share={() => onClickShare(handleEventShare)}
              />
            </div>
          ))}
        </div>
      );
    });

  useEffect(() => {
    const updateStickyHeaderTop = () => {
      const containerFixed = document.getElementById("containerFixed");
      if (containerFixed && headersRef.current) {
        const containerFixedHeight = containerFixed.offsetHeight;
        headersRef.current.forEach((header) => {
          if (header) header.style.top = `${containerFixedHeight}px`;
        });
      }
    };

    updateStickyHeaderTop();

    window.addEventListener("resize", updateStickyHeaderTop);

    return () => {
      window.removeEventListener("resize", updateStickyHeaderTop);
    };
  }, [dataEventCard]);

  const onClickOpenFecha = () => {
    const fondoTransparente = document.getElementById("fondoTransparente");
    if (!openFecha) {
      setOpenFecha(true);
      fondoTransparente.style.visibility = "visible";
    } else {
      setOpenFecha(false);
      fondoTransparente.style.visibility = "hidden";
    }
    setOpenGenero(false);
    setOpenUbicacion(false);
  };

  const onChangeDateRange = (value) => {
    setIsFiltering(true);
    setLazyLoadNoEvents(false);
    setLoaderLazyLoad(false);
    setFinishLazyLoad(true);
    if (value[0] === null && value[1] === null) {
      setFilter(() => ({
        ...filter,
        dates: [],
        page: 0,
        sharedId: "",
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
        sharedId: "",
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
        sharedId: "",
      }));
    } else {
      return null;
    }
  };

  const onClickDateRange = () => {
    const fondoTransparente = document.getElementById("fondoTransparente");
    fondoTransparente.style.visibility = "hidden";
    window.scroll(0, 0);
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
      setValueButtonFecha(`${fechaFormateada} - ${fechaFormateada2}`);
    }

    setLoader(true);
    setOpenFecha(false);
    axios
      .post(`${axiosUrl}/events/filtersNew`, filter)
      .then((res) => {
        const sortArray = res.data;
        sortArray.forEach((dateInfo) => {
          Object.keys(dateInfo).forEach((date) => {
            dateInfo[date].sort((a, b) => {
              // Encuentra la prioridad más baja (mayor prioridad) en los promoters de 'a'
              const priorityA = a.promoters.reduce((min, promoter) => {
                if (
                  promoter.priority !== null &&
                  (min === null || promoter.priority < min)
                ) {
                  return promoter.priority;
                }
                return min;
              }, null);

              // Encuentra la prioridad más baja (mayor prioridad) en los promoters de 'b'
              const priorityB = b.promoters.reduce((min, promoter) => {
                if (
                  promoter.priority !== null &&
                  (min === null || promoter.priority < min)
                ) {
                  return promoter.priority;
                }
                return min;
              }, null);

              // Comparación para el ordenamiento, tratando null como infinito
              return (
                (priorityA !== null ? priorityA : Infinity) -
                (priorityB !== null ? priorityB : Infinity)
              );
            });
          });
        });
        setDataEventCard(sortArray);
        setLoader(false);
        setLazyLoadNoEvents(false);
        setIsFiltering(false);
        setLoaderLazyLoad(false);
        setFinishLazyLoad(false);
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
    const fondoTransparente = document.getElementById("fondoTransparente");
    fondoTransparente.style.visibility = "hidden";
  };

  const onCloseFecha = () => {
    if (filter.dates.length) {
      window.scroll(0, 0);
      setFilter(() => ({
        ...filter,
        dates: [],
        page: 0,
        sharedId: "",
      }));
      if (openFecha) {
        setOpenFecha(false);
      }
      setFinishLazyLoad(true);
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
    const fondoTransparente = document.getElementById("fondoTransparente");
    if (!openUbicacion) {
      setOpenUbicacion(true);
      fondoTransparente.style.visibility = "visible";
    } else {
      setOpenUbicacion(false);
      fondoTransparente.style.visibility = "hidden";
    }
    setOpenFecha(false);
    setOpenGenero(false);
  };

  useEffect(() => {
    if (openUbicacion) {
      let ubicaion = document.getElementById("positionUbicacion");
      let containerFixed = document.getElementById("containerFixed");
      let containerFixedRect = containerFixed.getBoundingClientRect();
      let containerFixedBottom = containerFixedRect.bottom;
      let containerFixedLeft = containerFixedRect.left;

      if (window.innerWidth <= 650) {
        let sumaResponsive = containerFixedLeft + 15;
        ubicaion.style.visibility = "visible";
        ubicaion.style.top = `${containerFixedBottom}px`;
        ubicaion.style.left = `${sumaResponsive}px`;
      } else {
        ubicaion.style.visibility = "visible";
        ubicaion.style.top = `${containerFixedBottom}px`;
        ubicaion.style.left = `${containerFixedLeft}px`;
      }
    }
  }, [openUbicacion]);

  const onCloseUbicaion = () => {
    window.scroll(0, 0);
    let resetCheckedItems = Object.keys(checkedItemsCities).reduce(
      (acc, key) => {
        acc[key] = false;
        return acc;
      },
      {}
    );

    setCheckedItemsCities(resetCheckedItems);
    setFinishLazyLoad(true);
    setLoader(true);
    setAxiosCitie(true);
    setLazyLoadNoEvents(false);
    setLoaderLazyLoad(false);
    setIsFiltering(true);
    setCitieName([]);
    setFilter(() => ({
      ...filter,
      cities: [],
      page: 0,
      sharedId: "",
    }));
  };

  const onClickCheckBoxListUbicacion = (item) => {
    setCheckedItemsCities((prevState) => ({
      ...prevState,
      [item.id]: !prevState[item.id],
    }));
    window.scroll(0, 0);
    setFinishLazyLoad(true);
    setLoader(true);
    setAxiosCitie(true);
    setLazyLoadNoEvents(false);
    setLoaderLazyLoad(false);
    setIsFiltering(true);

    let arrayCitiesId = filter.cities;

    if (arrayCitiesId.includes(item.id)) {
      arrayCitiesId = arrayCitiesId.filter((id) => id !== item.id);
    } else {
      arrayCitiesId.push(item.id);
    }

    if (citieName[0] === "Ubicación") {
      var arrayCitiesName = [];
      arrayCitiesName.push(item.city_name);
    } else {
      var arrayCitiesName = citieName;
      if (arrayCitiesName.includes(item.city_name)) {
        arrayCitiesName = arrayCitiesName.filter(
          (name) => name !== item.city_name
        );
      } else {
        arrayCitiesName.push(item.city_name);
      }
    }

    setCitieName(arrayCitiesName);
    setFilter(() => ({
      ...filter,
      cities: arrayCitiesId,
      page: 0,
      sharedId: "",
    }));
  };

  const onClickOpenGenero = () => {
    const fondoTransparente = document.getElementById("fondoTransparente");
    if (!openGenero) {
      setOpenGenero(true);
      fondoTransparente.style.visibility = "visible";
    } else {
      setOpenGenero(false);
      fondoTransparente.style.visibility = "hidden";
    }
    setOpenFecha(false);
    setOpenUbicacion(false);
  };

  useEffect(() => {
    if (openGenero) {
      let genero = document.getElementById("positionGenero");

      let containerFixed = document.getElementById("containerFixed");
      let containerFixedRect = containerFixed.getBoundingClientRect();
      let containerFixedBottom = containerFixedRect.bottom;
      let containerFixedLeft = containerFixedRect.left;
      let suma = containerFixedLeft + 95;

      if (window.innerWidth <= 650) {
        let sumaResponsive = suma + 20;
        genero.style.visibility = "visible";
        genero.style.top = `${containerFixedBottom}px`;
        genero.style.left = `${sumaResponsive}px`;
      } else {
        genero.style.visibility = "visible";
        genero.style.top = `${containerFixedBottom}px`;
        genero.style.left = `${suma}px`;
      }
    }
  }, [openGenero]);

  const onCloseTypes = () => {
    if (filter.types.length) {
      window.scroll(0, 0);
      setFilter(() => ({
        ...filter,
        types: [],
        page: 0,
        sharedId: "",
      }));

      let resetCheckedItems = Object.keys(checkedItems).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      setCheckedItems(resetCheckedItems);

      setFinishLazyLoad(true);
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
    window.scroll(0, 0);
    setCheckedItems((prevState) => ({
      ...prevState,
      [item.id]: !prevState[item.id],
    }));
    let arrayTypes = filter.types;

    if (arrayTypes.some((type) => type.id === item.id)) {
      arrayTypes = arrayTypes.filter((type) => type.id !== item.id);
    } else {
      arrayTypes.push(item);
    }

    setFilter(() => ({
      ...filter,
      types: arrayTypes,
      page: 0,
      sharedId: "",
    }));
    setLoader(true);
    setAxiosType(true);
    setLazyLoadNoEvents(false);
    setIsFiltering(true);
    setLoaderLazyLoad(false);
    setFinishLazyLoad(true);
  };

  const onCloseTypesList = () => {
    onClickOpenGenero();
  };

  const onChangeInputSearch = (e) => {
    window.scroll(0, 0);
    setFilter(() => ({
      ...filter,
      search: e.target.value,
      page: 0,
      sharedId: "",
    }));
    setAxiosSearch(true);
    setLazyLoadNoEvents(false);
    setLoader(true);
    setIsFiltering(true);
    setLoaderLazyLoad(false);
    setFinishLazyLoad(true);
  };

  if (axiosType || axiosCitie || axiosFecha || axiosSearch) {
    if (openUbicacion) {
      let ubicaion = document.getElementById("positionUbicacion");
      let containerFixed = document.getElementById("containerFixed");
      let containerFixedRect = containerFixed.getBoundingClientRect();
      let containerFixedBottom = containerFixedRect.bottom;
      let containerFixedLeft = containerFixedRect.left;

      if (ubicaion) {
        if (window.innerWidth <= 650) {
          let sumaResponsive = containerFixedLeft + 15;
          ubicaion.style.visibility = "visible";
          ubicaion.style.top = `${containerFixedBottom}px`;
          ubicaion.style.left = `${sumaResponsive}px`;
        } else {
          ubicaion.style.visibility = "visible";
          ubicaion.style.top = `${containerFixedBottom}px`;
          ubicaion.style.left = `${containerFixedLeft}px`;
        }
      }
    }

    if (openGenero) {
      let genero = document.getElementById("positionGenero");

      let containerFixed = document.getElementById("containerFixed");
      let containerFixedRect = containerFixed.getBoundingClientRect();
      let containerFixedBottom = containerFixedRect.bottom;
      let containerFixedLeft = containerFixedRect.left;
      let suma = containerFixedLeft + 95;

      if (genero) {
        if (window.innerWidth <= 650) {
          let sumaResponsive = suma + 20;
          genero.style.visibility = "visible";
          genero.style.top = `${containerFixedBottom}px`;
          genero.style.left = `${sumaResponsive}px`;
        } else {
          genero.style.visibility = "visible";
          genero.style.top = `${containerFixedBottom}px`;
          genero.style.left = `${suma}px`;
        }
      }
    }
    axios
      .post(`${axiosUrl}/events/filtersNew`, filter)
      .then((res) => {
        setLoader(false);
        setAxiosType(false);
        setAxiosCitie(false);
        setAxiosFecha(false);
        setAxiosSearch(false);
        setFinishLazyLoad(false);
        setLazyLoadNoEvents(false);
        setIsFiltering(false);
        setLoaderLazyLoad(false);

        const sortArray = res.data;
        sortArray.forEach((dateInfo) => {
          Object.keys(dateInfo).forEach((date) => {
            dateInfo[date].sort((a, b) => {
              // Encuentra la prioridad más baja (mayor prioridad) en los promoters de 'a'
              const priorityA = a.promoters.reduce((min, promoter) => {
                if (
                  promoter.priority !== null &&
                  (min === null || promoter.priority < min)
                ) {
                  return promoter.priority;
                }
                return min;
              }, null);

              // Encuentra la prioridad más baja (mayor prioridad) en los promoters de 'b'
              const priorityB = b.promoters.reduce((min, promoter) => {
                if (
                  promoter.priority !== null &&
                  (min === null || promoter.priority < min)
                ) {
                  return promoter.priority;
                }
                return min;
              }, null);

              // Comparación para el ordenamiento, tratando null como infinito
              return (
                (priorityA !== null ? priorityA : Infinity) -
                (priorityB !== null ? priorityB : Infinity)
              );
            });
          });
        });
        setDataEventCard(sortArray);
      })
      .catch(() => {
        Alert(
          "Error!",
          "Error al cargar los eventos por favor intentar luego mas tarde o ponerse en contacto con el servidor",
          "error"
        );
      });
  }

  if (lazyLoad && !filter.sharedId) {
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
          dataCards.forEach((dateInfo) => {
            Object.keys(dateInfo).forEach((date) => {
              dateInfo[date].sort((a, b) => {
                // Encuentra la prioridad más baja (mayor prioridad) en los promoters de 'a'
                const priorityA = a.promoters.reduce((min, promoter) => {
                  if (
                    promoter.priority !== null &&
                    (min === null || promoter.priority < min)
                  ) {
                    return promoter.priority;
                  }
                  return min;
                }, null);

                // Encuentra la prioridad más baja (mayor prioridad) en los promoters de 'b'
                const priorityB = b.promoters.reduce((min, promoter) => {
                  if (
                    promoter.priority !== null &&
                    (min === null || promoter.priority < min)
                  ) {
                    return promoter.priority;
                  }
                  return min;
                }, null);

                // Comparación para el ordenamiento, tratando null como infinito
                return (
                  (priorityA !== null ? priorityA : Infinity) -
                  (priorityB !== null ? priorityB : Infinity)
                );
              });
            });
          });

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

          // Nueva función para eliminar eventos duplicados
          function removeDuplicateEvents(array) {
            array.forEach((data) => {
              const date = Object.keys(data)[0];
              const events = data[date];
              const uniqueEvents = [];

              events.forEach((event) => {
                if (!uniqueEvents.some((e) => e.id === event.id)) {
                  uniqueEvents.push(event);
                }
              });

              data[date] = uniqueEvents;
            });
            return array;
          }

          const uniqueArray = removeDuplicateEvents(newArray);
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

  if (!dataEventCard || !types || !cities) {
    return (
      <div className={styles.body}>
                  <Helmet>
                <title>{currentEventForShare.title}</title>
                <meta property="og:title" content={currentEventForShare.title} />
                <meta property="og:description" content={currentEventForShare.genre} />
                <meta property="og:image" content={currentEventForShare.image} />
            </Helmet>
        <div className={styles.containerFixed}>
          <div className={styles.containerInput}>
            <InputSearch PlaceHolder="Buscá un evento, artista o club" />
          </div>
          <div className={styles.containerButtons}>
            <ButtonPicker Value="Ubicación" />

            <ButtonPicker Value="Género" />

            <ButtonPicker Value="Fecha" />
          </div>
        </div>
        <div className={styles.containerSkeleton}>
          <SkeletonLoader />
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.body}>
                  <Helmet>
                <title>{currentEventForShare.title}</title>
                <meta property="og:title" content={currentEventForShare.title} />
                <meta property="og:description" content={currentEventForShare.genre} />
                <meta property="og:image" content={currentEventForShare.image} />
            </Helmet>
        <div className={styles.containerFixed} id="containerFixed">
          <div className={styles.containerInput}>
            <InputSearch
              PlaceHolder="Buscá un evento, artista o club"
              OnChange={onChangeInputSearch}
            />
          </div>
          <div className={styles.containerButtons}>
            {openUbicacion ||
            (citieName.length && citieName[0] !== "Ubicación") ? (
              <ButtonPickerSelected
                Value={
                  citieName.length > 1
                    ? citieName[0] + " + " + (citieName.length - 1)
                    : citieName.length === 1 && citieName[0] !== "Ubicación"
                    ? citieName[0]
                    : "Ubicación"
                }
                OnClick={onClickOpenUbicaion}
                OnClose={onCloseUbicaion}
                Close="true"
              />
            ) : (
              <ButtonPicker Value="Ubicación" OnClick={onClickOpenUbicaion} />
            )}

            {openGenero || filter.types.length ? (
              <ButtonPickerSelected
                Value={
                  filter.types.length > 1
                    ? filter.types[0].name + " + " + (filter.types.length - 1)
                    : filter.types.length === 1
                    ? filter.types[0].name
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

        <div className={styles.containerPicker} id="fondoTransparente">
          {openUbicacion ? (
            <div className={styles.containerUbicacion} id="positionUbicacion">
              <CheckBoxList
                cityList={cities}
                OnClick={onClickCheckBoxListUbicacion}
                OnClose={onClickOpenUbicaion}
                checkedItems={checkedItemsCities}
              />
            </div>
          ) : null}

          {openGenero ? (
            <div className={styles.containerGenero} id="positionGenero">
              <CheckBoxList
                typeList={types}
                checkedItems={checkedItems}
                OnClick={onClickCheckBoxListGenero}
                OnClose={onCloseTypesList}
              />
            </div>
          ) : null}

          {openFecha ? (
            <div className={styles.containerFecha}>
              <DateRange
                OnChange={onChangeDateRange}
                OnClick={onClickDateRange}
                OnClose={onCloseDateRange}
              />
            </div>
          ) : null}
        </div>

        {dataEventCard.length !== 0 && !loader ? (
          <div className={styles.bodyEventCard}>{elementDivCard}</div>
        ) : null}

        {dataEventCard.length === 0 && !loader ? (
          <div className={styles.noHayEventos}>
            <h1>No hay eventos con el filtro seleccionado</h1>
          </div>
        ) : null}

        {loader ? (
          <div className={styles.bodyLoader}>
            <SkeletonLoader />
          </div>
        ) : null}

        {!filter.sharedId && loaderLazyLoad ? (
          <div className={styles.bodyLoaderLazyLoad}>
            <Loader Color="#7c16f5" Height="50px" Width="50px" />
          </div>
        ) : null}

        {filter.sharedId || lazyLoadNoEvents ? (
          <div className={styles.bodyLoaderLazyLoad}>
            <p>No hay mas eventos</p>
          </div>
        ) : null}

        <Footer />
      </div>
    );
  }
}

export default HomePage;
