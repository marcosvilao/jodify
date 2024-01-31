import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import styles from "./datePicker.module.css";
import dayjs from "dayjs";

const customTheme = (outerTheme, hasError) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
      ...(hasError && {
        error: {
          main: "#FF5353",
        },
      }),
    },
    components: {
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            "& .MuiTypography-root": {
              color: "#ffffff !important",
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
              backgroundColor: "#AE71F9",
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
              borderStyle: "none",
              backgroundColor: "#1b1c20",
            },
            "&.MuiPickersDay-today-selected": {
              backgroundColor: "#AE71F9",
              borderStyle: "none",
              borderRadius: "50%",
              color: "#000000",
            },
            "&.MuiPickersDay-today-selected:focus": {
              backgroundColor: "#AE71F9",
              color: "#000000",
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
            "&.Mui-selected:focus": {
              backgroundColor: "#AE71F9",
              color: "#000000",
              borderStyle: "none",
              borderRadius: "50%",
            },
            "&.Mui-disabled": {
              color: "gray !important",
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
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": hasError ? "#FF5353" : "#E0E3E7",
            "--TextField-brandBorderHoverColor": hasError
              ? "#FF5353"
              : "#AE71F9",
            "--TextField-brandBorderFocusedColor": hasError
              ? "#FF5353"
              : "#AE71F9",
            "& label.Mui-focused": {
              color: hasError ? "#FF5353" : "#AE71F9",
            },
            "& label": {
              color: hasError ? "#FF5353" : "#ffffff",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: "var(--TextField-brandBorderColor)",
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: hasError ? "#FF0000" : "#AE71F9",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: hasError ? "#FF0000" : "#AE71F9",
            },
            "& input": {
              color: "#ffffff",
            },
            "&.Mui-focused input": {
              color: hasError ? "#FF5353" : "#AE71F9",
            },
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
    },
  });

function CustomDatePicker(props) {
  const outerTheme = useTheme();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const hasError = props.Error !== "" && props.Error; // Asumiendo que 'Error' es una cadena

  const handleOpenDatePicker = () => {
    if (!isDatePickerOpen) {
      setIsDatePickerOpen(true);
    } else {
      return null;
    }
  };

  const handleCloseDatePicker = () => {
    if (isDatePickerOpen) {
      setIsDatePickerOpen(false);
    } else {
      return null;
    }
  };

  // Actualiza la función 'customTheme' para incluir estilos de error
  const themeWithError = customTheme(outerTheme, hasError);

  return (
    <ThemeProvider theme={themeWithError}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={["DatePicker"]}
          sx={{
            width: "100%",
            margin: props.Margin ? props.Margin : "10px 0px",
          }}
        >
          <div style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
              onClick={handleOpenDatePicker}
            >
              <MobileDatePicker
                label={props.Label}
                className={styles.datePicker}
                onClose={handleCloseDatePicker}
                open={isDatePickerOpen}
                onChange={props.OnChange}
                minDate={dayjs()}
                error={!!hasError}
              />

              <CalendarMonthIcon
                className={styles.icon}
                label="Seleccion una fecha"
              />
            </div>
            {hasError && (
              <div style={{ width: "100%", marginTop: "5px" }}>
                <p
                  style={{
                    color: "#FF5353",
                    margin: "0px",
                    fontSize: "13px",
                  }}
                >
                  {props.Error}
                </p>
              </div>
            )}
          </div>
        </DemoContainer>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default CustomDatePicker;