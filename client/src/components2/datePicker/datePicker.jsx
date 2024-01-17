import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import styles from "./datePicker.module.css";

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
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
      MuiFilledInput: {
        styleOverrides: {
          root: {
            "&::before, &::after": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
            "&.Mui-focused": {
              backgroundColor: "#1b1c20", // Color de fondo cuando está enfocado
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&::before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
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
    <ThemeProvider theme={customTheme(outerTheme)} sx={{ width: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: "100%" }}>
        <DemoContainer
          components={["DatePicker"]}
          sx={{ width: "100%", position: "relative" }}
        >
          <div
            style={{ width: "100%" }}
            onClick={handleOpenDatePicker}
          >
            <MobileDatePicker
              sx={{ width: "100%" }}
              label="Seleccion una fecha"
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
