import React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

function Table(props) {
  return (
    <Box sx={{ height: props.Heigth, width: props.Width }}>
      <DataGrid
        style={{ fontWeight: "bold" }}
        rows={props.Rows ? props.Rows : []}
        columns={props.Columns ? props.Columns : []}
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
  );
}

export default Table;
