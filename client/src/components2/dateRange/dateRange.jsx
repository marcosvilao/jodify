import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRange } from "./dateRangeStyles";
import theme from "../../jodifyStyles";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

const customTheme = () =>
  createTheme({
    components: {
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            gap: "10px",
            "& .MuiTypography-root": {
              color: "#ffffff !important",
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
          disableHighlightToday={true}
          minDate={dayjs()}
          localeText={{ start: "Inicio", end: "Fin" }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default DateRanges;
