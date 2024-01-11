import React, { useState, useEffect } from "react";
import Table from "../../components2/table/table";
import axios from "axios";
import Loader from "../../components2/loader/loader";
import Alert from "../../components2/alert/alert";

function WeekEventsPage() {
  const [dataEvents, setDataEvents] = useState(false);
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;

  useEffect(() => {
    if (dataEvents === false) {
      axios
        .get(axiosUrl + "/events-promoters")
        .then((res) => {
          setDataEvents(res.data);
        })
        .catch(() => {
          Alert("Error!", "Network error", "error");
        });
    }
  }, []);

  if (dataEvents !== false) {
    const columns = [
      {
        field: "evento",
        headerName: "Evento",
        width: 500,
        editable: false,
      },
      {
        field: "lugar",
        headerName: "Lugar    ",
        width: 300,
        editable: false,
      },
      {
        field: "fecha",
        headerName: "Fecha",
        width: 110,
        editable: false,
      },
      {
        field: "djs",
        headerName: "Djs",
        width: 300,
        editable: false,
      },
      {
        field: "genero",
        headerName: "Genero",
        width: 300,
        editable: false,
      },
      {
        field: "ticketlink",
        headerName: "Ticket Link",
        width: 300,
        editable: false,
      },
      {
        field: "productora",
        headerName: "Productora",
        width: 300,
        editable: false,
      },
      {
        field: "intagram",
        headerName: "Instagram",
        width: 300,
        editable: false,
      },
    ];

    const rows = [];

    let id = 0;
    dataEvents.eventos.map((i) => {
      let resultadoDjs = i.event_djs.join(" ");
      rows.push({
        id: id,
        evento: i.event_title,
        lugar: i.event_location,
        fecha: i.event_date,
        djs: resultadoDjs,
        genero: i.event_type,
        ticketlink: i.ticket_link,
        productora: i.name,
        intagram: i.instagram,
      });
      id = id + 1;
    });

    return (
      <div
        style={{
          width: "100%",
          background: "#ffffff",
          padding: "10px 0px"
        }}
      >
        <h1 style={{ marginLeft: "5px" }}>Tabla de eventos:</h1>
        <Table Rows={rows} Columns={columns} Heigth="650px" Width="100%" />
      </div>
    );
  } else {
    return (
      <div
        style={{
          width: "100%",
          height: "87vh",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader Color="#7c16f5" Height="100px" Width="100px" />
      </div>
    );
  }
}

export default WeekEventsPage;
