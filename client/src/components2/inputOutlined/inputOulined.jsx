import React from "react";
import styles from "./inputOutlined.module.css";
import TextField from "@mui/material/TextField";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

const customTheme = (outerTheme, hasError) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
      ...(hasError && {
        error: {
          main: "#FF5353", // Color de error
        },
      }),
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": hasError ? "#FF5353" : "#FFFFFF",
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
              color: hasError ? "#FF5353" : "#ffffff", // Color del label
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
              color: "#FF5353",
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

function InputOutlined(props) {
  const outerTheme = useTheme();
  const hasError = props.Error !== "" && props.Error;

  if (hasError) {
    return (
      <ThemeProvider theme={customTheme(outerTheme, hasError)}>
        <div
          style={{
            width: "100%",
            margin: props.Margin ? props.Margin : "10px 0px",
          }}
        >
          <TextField
            label={props.Label}
            variant="outlined"
            className={styles.inputBlack}
            placeholder={props.Placeholder}
            name={props.Name}
            value={props.Value}
            onChange={props.OnChange}
            type={props.Type}
            required
            InputProps={{
              style: {
                color: "#FF5353",
              },
            }}
            InputLabelProps={{
              style: {
                color: "#FF5353",
              },
            }}
            error={hasError}
          />

          {hasError ? (
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
          ) : null}
        </div>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={customTheme(outerTheme, hasError)}>
        <div
          style={{
            width: "100%",
            margin: props.Margin ? props.Margin : "10px 0px",
          }}
        >
          <TextField
            label={props.Label}
            variant="outlined"
            className={styles.inputBlack}
            placeholder={props.Placeholder}
            name={props.Name}
            value={props.Value}
            onChange={props.OnChange}
            type={props.Type}
            required={props.Requiere ? false : true}
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

export default InputOutlined;
