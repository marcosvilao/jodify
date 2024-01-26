import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: "dark",
    },
    components: {
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            display: "none",
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
          sx={{ color: "#ffffff" }}
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
