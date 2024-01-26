import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import styles from "./datePicker.module.css";

const customTheme = (outerTheme) =>
  createTheme({
    components: {
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            '& .MuiTypography-root': { // Selector más general
              color: "#ffffff !important", // Uso de !important
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
              backgroundColor: "#90CAF9",
              color: "#000000",
              borderStyle: "none",
              borderRadius: "50%",
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
            "--TextField-brandBorderColor": "#E0E3E7",
            "--TextField-brandBorderHoverColor": "#B2BAC2",
            "--TextField-brandBorderFocusedColor": "#6F7E8C",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
            "& label": {
              color: "#ffffff", // Color del texto del label
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
              borderColor: "var(--TextField-brandBorderHoverColor)",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderFocusedColor)",
            },
            "& input": {
              color: "#ffffff", // Color del texto del input
            },
            "&.Mui-focused input": {
              color: "#ffffff", // Color del texto del input cuando está enfocado
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

  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={["DatePicker"]}
          sx={{
            width: "100%",
            position: "relative",
            margin: props.Margin ? props.Margin : "10px 0px",
          }}
        >
          <div style={{ width: "100%" }} onClick={handleOpenDatePicker}>
            <MobileDatePicker
              label={props.Label}
              className={styles.datePicker}
              onClose={handleCloseDatePicker}
              open={isDatePickerOpen}
              onChange={props.OnChange}
            />

            <CalendarMonthIcon
              className={styles.icon}
              label="Seleccion una fecha"
            />
          </div>
        </DemoContainer>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default CustomDatePicker;
