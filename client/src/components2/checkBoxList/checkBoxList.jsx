import React, { useEffect, useRef, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { createTheme } from "@mui/material/styles";
import theme from "../../jodifyStyles";

const themes = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function CheckBoxList({ cityList, typeList, checkedItems, OnClick, OnClose }) {
  const listRef = useRef(null);

  const handleClickOutside = (event) => {
    if (listRef.current && !listRef.current.contains(event.target)) {
      OnClose?.();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    OnClick?.(item);
  };

  const renderListItems = (list, isCityList) => {
    return (
      <div
        ref={listRef}
        style={{
          maxHeight: "280px",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#0C0C0C #1B1C20",
        }}
      >
        <List
          sx={{
            width: "200px",
            bgcolor: theme.jodify_colors._background_gray,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {list.map((item, index) => {
            const labelId = `checkbox-list-label-${index}`;
            const isChecked = checkedItems[item.id] || false;
            return (
              <ListItem
                key={index}
                disablePadding
                sx={{ marginBottom: "0px", height: "35px" }}
              >
                <ListItemButton
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: theme.jodify_colors._text_white,
                    ...(isChecked && {
                      color: "#c18fff",
                    }),
                    [themes.breakpoints.up("sm")]: {
                      "&:hover": {
                        color: "#c18fff",
                        bgcolor: "#000000",
                        "& .MuiCheckbox-root, & .MuiTypography-root": {
                          transform: "scale(1.1)",
                        },
                      },
                    },
                  }}
                  role={undefined}
                  dense
                  onClick={() => handleItemClick(item)}
                >
                  <ListItemIcon sx={{ minWidth: "20px" }}>
                    <Checkbox
                      edge="start"
                      checked={isChecked}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      sx={{
                        color: "#c18fff",
                        "&.Mui-checked": {
                          color: "#c18fff",
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={isCityList ? item.city_name : item.name}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  };

  return (
    <div
      style={{
        overflowY: "auto",
        position: "absolute",
        zIndex: "3",
        borderRadius: theme.jodify_borders._lg_border_radius,
      }}
    >
      {cityList
        ? renderListItems(cityList, true)
        : renderListItems(typeList || [], false)}
    </div>
  );
}

export default CheckBoxList;
