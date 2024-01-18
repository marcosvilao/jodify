import React from "react";
import styles from "./selectBlack.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

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
      MuiAutocomplete: {
        styleOverrides: {
          popupIndicator: {
            color: "#ffffff", // Color blanco para la flecha hacia abajo
          },
          clearIndicator: {
            color: "#ffffff", // Color blanco para la cruz de borrado
          },
          endAdornment: {
            color: "#ffffff", // Color blanco para el texto seleccionado
          },
          tag: {
            backgroundColor: "#1b1c20", // Color de fondo de las opciones seleccionadas
            color: "#ffffff", // Color del texto de las opciones seleccionadas
            "& .MuiSvgIcon-root": {
              color: "#ffffff", // Color del icono de eliminar ('X') en opciones seleccionadas
              "&:hover": {
                color: "#888888", // Color gris cuando haces hover sobre el icono de eliminar
              },
            },
          },
        },
      },
    },
  });

function SelectBlack(props) {
  const outerTheme = useTheme();

  if (props.Multiple === false) {
    return (
      <ThemeProvider theme={customTheme(outerTheme)}>
        <Autocomplete
          style={{ margin: "10px 0px" }}
          className={styles.selectBlack}
          multiple={false}
          id="tags-outlined"
          options={props.Array}
          getOptionLabel={(option) => option.value}
          filterSelectedOptions
          onChange={props.OnChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={props.Option}
              placeholder={props.PlaceHolder}
            />
          )}
        />
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={customTheme(outerTheme)}>
        <Autocomplete
          style={{ margin: "10px 0px" }}
          className={styles.selectBlack}
          multiple
          id="tags-outlined"
          options={props.Array}
          getOptionLabel={(option) => option.value}
          filterSelectedOptions
          onChange={props.OnChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={props.Option}
              placeholder={props.PlaceHolder}
            />
          )}
        />
      </ThemeProvider>
    );
  }
}

export default SelectBlack;
