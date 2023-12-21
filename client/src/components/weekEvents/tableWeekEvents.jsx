import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

function TableWeekEvents() {
  const [dataEvents, setDataEvents] = useState(false);

  useEffect(() => {
    if (dataEvents === false) {
      axios
        .get("http://localhost:3001/events-promoters")
        .then((res) => {
          setDataEvents(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

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

  const rows2 = [];

  if (dataEvents !== false) {
    let id = 0;
    dataEvents.eventos.map((i) => {
      console.log(i);
      let resultadoDjs = i.event_djs.join(" ");
      rows2.push({
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
  }

  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
      }}
    >
      <h1 style={{ marginLeft: "15px" }}>Tabla de eventos</h1>

      <Box sx={{ height: 650, width: "100%" }}>
        <DataGrid
          style={{ fontWeight: "bold" }}
          rows={rows2}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection={false}
        />
      </Box>
    </div>
  );
}

export default TableWeekEvents;
