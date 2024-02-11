import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
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
              color: "#ffffff",
            },
            "&.Mui-selected:focus": {
              backgroundColor: "#AE71F9",
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
              backgroundColor: "#AE71F9",
              borderStyle: "none",
              borderRadius: "50%",
              color: "#ffffff",
            },
            "&.MuiPickersDay-today-selected:focus": {
              backgroundColor: "#AE71F9",
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
  const [selectedDate, setSelectedDate] = useState(
    props.InitialDate ? dayjs(props.InitialDate, "MM/DD/YYYY") : null
  );
  const hasError = props.Error !== "" && props.Error;

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

  const themeWithError = customTheme(outerTheme, hasError);

  useEffect(() => {
    if (props.InitialDate) {
      setSelectedDate(dayjs(props.InitialDate, "MM/DD/YYYY"));
    } else {
      setSelectedDate(null);
    }
  }, [props.InitialDate]);

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
                className={styles.datePicker}
                label={props.Label}
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                  if (props.OnChange) {
                    props.OnChange(newValue);
                  }
                }}
                onClose={handleCloseDatePicker}
                open={isDatePickerOpen}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={styles.datePicker}
                    error={!!hasError}
                  />
                )}
                error={!!hasError}
                minDate={dayjs()}
              />
              <CalendarMonthIcon
                className={styles.icon}
                onClick={handleOpenDatePicker}
              />
            </div>
            {hasError && (
              <div style={{ width: "100%", marginTop: "5px" }}>
                <p
                  style={{ color: "#FF5353", margin: "0px", fontSize: "13px" }}
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
