import React from "react";
import logo from "../../assets/logo-jodify/JODIFY_Iso_Gradient.svg";
import theme from "../../jodifyStyles";

function LogoJodify(props) {
  return (
    <img
      style={{
        borderRadius: theme.jodify_borders._lg_border_radius,
        cursor: "pointer",
        margin: "15px 0px"
      }}
      width="60px"
      height="60px"
      src={logo}
      alt="Error al cargar el logo"
      onClick={props.OnClick}
    />
  );
}

export default LogoJodify;
