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
            "& .MuiTypography-root": {
              color: "#ffffff !important",
            },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: "#ffffff",
            "&.Mui-selected": {
              backgroundColor: "linear-gradient(90deg, rgb(234, 51, 247) 0%, rgb(124, 22, 245) 100%)",
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
            "&.Mui-selected:focus": {
              backgroundColor: "linear-gradient(90deg, rgb(234, 51, 247) 0%, rgb(124, 22, 245) 100%)",
              color: "#000000",
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
          disableHighlightToday={true}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default DateRanges;
