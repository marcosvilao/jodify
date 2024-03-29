import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

function ButtonCreateEvents(props) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const buttonStyle = {
    width: "100%",
    height: "45px",
    fontWeight: "bold",
    textTransform: "none",
    fontSize: "16px",
    backgroundColor: isHovered
      ? props.Color
        ? props.Color
        : "#AE71F9"
      : props.Hover
      ? props.Hover
      : "#7c16f5",
  };

  return (
    <Stack spacing={2} direction="row" style={{ width: "100%" }}>
      <Button
        variant="contained"
        onClick={props.OnClick}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {props.Value}
      </Button>
    </Stack>
  );
}

export default ButtonCreateEvents;
