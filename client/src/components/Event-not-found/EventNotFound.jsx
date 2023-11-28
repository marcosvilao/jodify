import React, { useEffect, useState } from "react";
import theme from "../../jodifyStyles";
import { useSelector } from "react-redux";

function EventNotFound() {
  const isSearching = useSelector((state) => state.search.isSearching);
  const [MarginTop, setMarginTop] = useState(50);

  useEffect(() => {

    if (window.innerWidth < 500) {
      setMarginTop(5);
    }
  }, []);

  return (
    <div
      className="div-event-not-found"
      style={{
        display: "flex",
        width: "100%",
        marginTop: isSearching ? "10%" : `${MarginTop}%`,
        height: "14px",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          color: theme.jodify_colors._text_white,
          fontFamily: theme.fonts._title_font_family,
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: "500",
          lineHeight: "normal",
        }}
      >
        No se encontraron eventos.
      </p>
    </div>
  );
}

export default EventNotFound;
