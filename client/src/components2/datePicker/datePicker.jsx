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
    palette: {
      mode: "dark",
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
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            display: "none",
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
              sx={{ color: "#ffffff" }}
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
