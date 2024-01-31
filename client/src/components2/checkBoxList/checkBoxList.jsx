import React, { useEffect, useRef, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import { ItemTextList } from "./checkBoxListStyles.js";
import theme from "../../jodifyStyles";

function CheckBoxList({
  cityList,
  typeList,
  checkedItems,
  OnClick,
  OnClose,
}) {
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
      <div ref={listRef}>
        <List
          sx={{
            color: theme.jodify_colors._text_white,
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
                sx={{ marginBottom: "10px", height: "30px" }}
              >
                <ListItemButton
                  sx={{
                    height: "19px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
                      style={{ color: theme.jodify_colors._text_white }}
                    />
                  </ListItemIcon>
                  <ItemTextList
                    id={labelId}
                    primary={isCityList ? item.city_name : item.type_name}
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
        maxHeight: "280px",
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
