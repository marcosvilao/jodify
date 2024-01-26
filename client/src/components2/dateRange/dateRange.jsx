import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRange } from "./dateRangeStyles";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import theme from "../../jodifyStyles";

const customTheme = (outerTheme) =>
  createTheme({
    components: {
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            display: "none",
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: "#ffffff",
            "&.Mui-selected": {
              backgroundColor: "#90CAF9",
              borderStyle: "none",
              borderRadius: "50%",
              color: "#000000",
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              borderColor: "#ffffff",
              borderWidth: "1px",
              borderStyle: "solid",
            },
            "&.MuiPickersDay-today": {
              borderColor: "#ffffff",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "50%",
              backgroundColor: "#1b1c20",
            },
            "&.Mui-selected:focus": {
              backgroundColor: "#90CAF9", // Fondo para la fecha seleccionada en foco
              color: "#000000", // Color del texto para la fecha seleccionada en foco
              borderStyle: "none",
              borderRadius: "50%",
            },
          },
        },
      },
    },
  });

function DateRanges(props) {
  const outerTheme = useTheme();
  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRange
          sx={{
            fontSize: "16px",
            color: theme.jodify_colors._text_white,
            bgcolor: theme.jodify_colors._background_gray,
            borderRadius: theme.jodify_borders._lg_border_radius,
          }}
          value={props.Value}
          onChange={props.OnChange}
          onAccept={props.OnClick}
          onClose={props.OnClose}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default DateRanges;
