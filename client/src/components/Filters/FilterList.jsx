import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import { ItemTextList } from './FilterEventsStyles';
import theme from '../../jodifyStyles';

function FilterList({ typeList, cityList, checkedItems, setCheckedItems }) {
  const [checked, setChecked] = useState(checkedItems);

const handleToggle = (value) => () => {
  const currentIndex = checked.indexOf(value);
  let newChecked;

  if (currentIndex === -1) {
    // If the item is not checked, set the newChecked array to contain only the current value
    newChecked = [value];
  } else {
    // If the item is already checked, uncheck it by setting an empty array
    newChecked = [];
  }

  setChecked(newChecked);
  setCheckedItems(newChecked);
};
  

  const renderListItems = (list, isCityList) => {
    return (
      <List
        sx={{
          color: theme.jodify_colors._text_white,
          width: '200px',
          bgcolor: theme.jodify_colors._background_gray,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          // borderTopRightRadius: 'none',
          // borderRadius: theme.jodify_borders._lg_border_radius
        }}
      >
        {list.map((item, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            <ListItem key={index} disablePadding sx={{ marginBottom: '10px', height: '30px' }}>
              <ListItemButton
                sx={{
                  height: '19px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                role={undefined}
                onClick={handleToggle(index)}
                dense
              >
                <ListItemIcon sx={{ minWidth: '20px' }}>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(index) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                    style={{ color: theme.jodify_colors._text_white }}
                  />
                </ListItemIcon>
                <ItemTextList id={labelId} primary={isCityList ? item.city_name : item.type_name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <div style={{ maxHeight: '280px', overflowY: 'auto', position: 'absolute', zIndex: '3', borderRadius: theme.jodify_borders._lg_border_radius }}>
      {cityList ? renderListItems(cityList, true) : renderListItems(typeList || [], false)}
    </div>
  );
}

export default FilterList;