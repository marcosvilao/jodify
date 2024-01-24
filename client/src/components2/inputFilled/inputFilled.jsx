import React from "react";
import styles from "./inputFilled.module.css";
import TextField from "@mui/material/TextField";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

const customTheme = (outerTheme, hasError) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
      ...(hasError && {
        error: {
          main: "#ff0000", // Color de error
        },
      }),
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": hasError ? "#ff0000" : "#FFFFFF",
            "--TextField-brandBorderHoverColor": hasError
              ? "#ff0000"
              : "#B2BAC2",
            "--TextField-brandBorderFocusedColor": hasError
              ? "#ff0000"
              : "#AE71F9",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
            "& label": {
              color: hasError ? "#ff0000" : "#ffffff", // Color del label
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
          },
        },
      },
      MuiInputLabel: {
        // Estilos para MuiInputLabel
        styleOverrides: {
          root: {
            color: "#ffffff",
            "&.Mui-focused": {
              color: "#AE71F9",
            },
            "&.Mui-error": {
              color: "#ff0000",
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
          },
        },
      },
    },
  });

function InputBlack(props) {
  const outerTheme = useTheme();
  const hasError = props.Error !== "" && props.Error;

  if (hasError) {
    return (
      <ThemeProvider theme={customTheme(outerTheme, hasError)}>
        <div style={{ width: "100%", margin: "10px 0px", zIndex: "0" }}>
          <TextField
            label={props.Label}
            variant="filled"
            className={styles.inputBlack}
            placeholder={props.Placeholder}
            name={props.Name}
            value={props.Value}
            onChange={props.OnChange}
            type={props.Type}
            required
            InputProps={{
              style: {
                color: "#ff0000",
              },
            }}
            InputLabelProps={{
              style: {
                color: "#ff0000",
              },
            }}
            error={hasError}
          />

          {hasError ? (
            <div style={{ width: "100%", marginTop: "5px" }}>
              <p
                style={{
                  color: "red",
                  margin: "0px",
                  fontSize: "13px",
                }}
              >
                {props.Error}
              </p>
            </div>
          ) : null}
        </div>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={customTheme(outerTheme, hasError)}>
        <div style={{ width: "100%", margin: "10px 0px" }}>
          <TextField
            label={props.Label}
            variant="filled"
            className={styles.inputBlack}
            placeholder={props.Placeholder}
            name={props.Name}
            value={props.Value}
            onChange={props.OnChange}
            type={props.Type}
            required
            InputProps={{
              style: {
                color: "#ffffff",
              },
            }}
          />
        </div>
      </ThemeProvider>
    );
  }
}

export default InputBlack;
