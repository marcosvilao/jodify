import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

function Loader(props) {
  return (
    <CircularProgress
      style={{ color: props.Color, height: props.Height, width: props.Width }}
    />
  );
}

export default Loader;
