import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import { ItemTextList } from "./checkBoxListStyles.js";
import theme from "../../jodifyStyles";

function CheckBoxList(props) {
  const renderListItems = (list, isCityList) => {
    return (
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
              >
                <ListItemIcon sx={{ minWidth: "20px" }}>
                  <Checkbox
                    edge="start"
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                    style={{ color: theme.jodify_colors._text_white }}
                    onClick={() => props.OnClick(item)}
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
      {props.cityList
        ? renderListItems(props.cityList, true)
        : renderListItems(props.typeList || [], false)}
    </div>
  );
}

export default CheckBoxList;
