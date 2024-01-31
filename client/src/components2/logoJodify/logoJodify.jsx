import React from "react";
import logo from "../../assets/JODIFY_Iso_Gradient.maskable.svg";
import theme from "../../jodifyStyles";

function LogoJodify(props) {
  return (
    <img
      style={{
        borderRadius: theme.jodify_borders._lg_border_radius,
        margin: "15px 0px",
      }}
      width={props.Width ? props.Width : "60px"}
      height={props.Height ? props.Height : "60px"}
      src={logo}
      alt="Error al cargar el logo"
    />
  );
}

export default LogoJodify;
