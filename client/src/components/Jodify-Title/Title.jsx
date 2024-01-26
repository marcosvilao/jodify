import React from "react";
import theme from "../../jodifyStyles";
import { BrandContainer } from "./Title";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";

function Title() {

  return (
    <BrandContainer>
      <a href="https://jodify.com.ar/">
        <img
          style={{ borderRadius: theme.jodify_borders._lg_border_radius }}
          src={logo}
          alt=""
          width="60px"
          height="60px"
        />
      </a>

    </BrandContainer>
  );
}

export default Title;
