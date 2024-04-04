import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import theme from "../../jodifyStyles";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            "& .MuiTypography-root": {
              color: "#ffffff !important",
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "Roboto Condensed, sans-serif",
              letterSpacing: "0",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#ffffff",
            fontSize: "14px",
            fontFamily: "Roboto Condensed",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.02)", // Color de fondo en hover
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "#ffffff",
            fontWeight: "bold",
            "&.Mui-disabled": {
              color: "#725E76 !important",
            },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: "#ffffff",
            fontSize: "14px",
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            fontWeight: "500",
            "&.Mui-selected": {
              backgroundImage:
                "linear-gradient(105deg, #8800ff 20%, #c18fff 100%)",
              borderStyle: "none",
              borderRadius: "50%",
              color: "#ffffff",
            },
            "&.Mui-selected:focus": {
              backgroundImage:
                "linear-gradient(105deg, #8800ff 20%, #c18fff 100%)",
              color: "#ffffff",
              borderStyle: "none",
              borderRadius: "50%",
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              borderColor: "#ffffff",
              borderWidth: "1px",
              borderStyle: "solid",
            },
            "&.MuiPickersDay-today": {
              borderStyle: "none",
              backgroundColor: "#1b1c20",
            },
            "&.MuiPickersDay-today-selected": {
              backgroundImage:
                "linear-gradient(105deg, #8800ff 20%, #c18fff 100%)",
              borderStyle: "none",
              borderRadius: "50%",
              color: "#ffffff",
            },
            "&.MuiPickersDay-today-selected:focus": {
              backgroundImage:
                "linear-gradient(105deg, #8800ff 20%, #c18fff 100%)",
              color: "#ffffff",
              borderStyle: "none",
              borderRadius: "50%",
            },
            "&.MuiPickersDay-today:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              borderColor: "#ffffff",
              borderWidth: "1px",
              borderStyle: "solid",
            },
            "&.Mui-disabled": {
              color: "#725E76 !important",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#1b1c20",
            color: "#ffffff",
          },
        },
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          label: {
            color: "#ffffff",
            fontSize: "16px",
            fontFamily: "Roboto Condensed",
          },
          switchViewIcon: {
            display: "none",
          },
        },
      },
      MuiDayCalendar: {
        styleOverrides: {
          weekDayLabel: {
            color: "#ffffff",
          },
        },
      },
      MuiDateRangePickerDay: {
        styleOverrides: {
          rangeIntervalDayHighlight: {
            backgroundColor: "#343335",
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
        <StaticDateRangePicker
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
