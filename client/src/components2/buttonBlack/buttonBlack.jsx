import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

function ButtonBlack(props) {
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
    backgroundColor: isHovered ? "#000000" : "#1B1C20",
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

export default ButtonBlack;
