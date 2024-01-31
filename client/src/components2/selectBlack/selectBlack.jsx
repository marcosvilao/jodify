import React from "react";
import styles from "./selectBlack.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
              color: hasError ? "#FF5353" : "#ffffff", // Color del texto del input
            },
            "&.Mui-focused input": {
              color: hasError ? "#FF5353" : "#ffffff", // Color del texto del input cuando está enfocado
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
            backgroundColor: "#413C47", // Color de fondo de las opciones seleccionadas
            color: "#ffffff", // Color del texto de las opciones seleccionadas
            "& .MuiSvgIcon-root": {
              color: "gray", // Color del icono de eliminar ('X') en opciones seleccionadas
              "&:hover": {
                color: "lightgray", // Color gris cuando haces hover sobre el icono de eliminar
              },
            },
          },
        },
      },
    },
  });

function SelectBlack(props) {
  const outerTheme = useTheme();
  const hasError = props.Error !== "" && props.Error;
  const optionsArray = props.Array || [];
  const [inputValue, setInputValue] = React.useState("");

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleChange = (event, newValue) => {
    if (Array.isArray(newValue)) {
      props.OnChange(event, newValue);
    } else if (newValue && typeof newValue === "object") {
      var valueToSet = newValue?.value;
      setInputValue(valueToSet);
      props.OnChange(event, newValue);
    } else if (newValue && typeof newValue === "string") {
      var valueToSet = newValue;
      setInputValue(valueToSet);
      props.OnChange(event, newValue);
    }
  };

  if (props.Multiple === false) {
    return (
      <ThemeProvider theme={customTheme(outerTheme, hasError)}>
        <div style={{ margin: props.Margin ? props.Margin : "10px 0px" }}>
          <Autocomplete
            freeSolo
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleChange}
            className={styles.selectBlack}
            multiple={false}
            id="tags-outlined"
            options={optionsArray}
            getOptionLabel={(option) =>
              typeof option === "object" && option ? option.value : option
            }
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label={props.Option}
                placeholder={props.PlaceHolder}
                error={!!hasError}
              />
            )}
          />
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
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={customTheme(outerTheme, hasError)}>
        <div style={{ margin: props.Margin ? props.Margin : "10px 0px" }}>
          <div className={styles.positionAbsolute}>
            <Autocomplete
              freeSolo
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onChange={handleChange}
              className={styles.selectBlack}
              multiple
              id="tags-outlined"
              options={optionsArray}
              getOptionLabel={(option) =>
                typeof option === "object" && option ? option.value : option
              }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={props.Option}
                  placeholder={props.PlaceHolder}
                  error={!!hasError}
                />
              )}
            />
            <ArrowDropDownIcon className={styles.icon} />
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
      </ThemeProvider>
    );
  }
}

export default SelectBlack;
