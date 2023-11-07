import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import theme from '../../jodifyStyles';
import { Box } from '@mui/material';
import { OkBtn } from './FilterEventsStyles';
import { ItemTextList } from './FilterEventsStyles';


function FilterList({ typeList, cityList, checkedItems, setCheckedItems }) {
    const [checked, setChecked] = React.useState(checkedItems);
    const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setCheckedItems(newChecked);
  };
  
  if(cityList){
    return (
      <div style={{maxHeight: '280px', overflowY: 'auto', position: 'absolute', zIndex: '3', borderRadius: theme.jodify_borders._lg_border_radius }}>
      <List sx={{color: theme.jodify_colors._text_white, width: '200px', bgcolor: theme.jodify_colors._background_gray, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: theme.jodify_borders._lg_border_radius }}>
      {cityList.map((item, index) => {
        const labelId = `checkbox-list-label-${index}`;
  
        return (
          <ListItem key={index} disablePadding sx={{ marginBottom: '10px', height: '30px' }}>
            <ListItemButton sx={{height: '19px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} role={undefined} onClick={handleToggle(index)} dense>
              <ListItemIcon sx={{minWidth: '20px'}}>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(index) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  style={{ color: theme.jodify_colors._text_white }}
                />
              </ListItemIcon>
              <ItemTextList id={labelId} primary={item.city_name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
    </div>
    );
  } else {
    return (
    <div style={{maxHeight: '280px', overflowY: 'auto', position: 'absolute', zIndex: '3', borderRadius: theme.jodify_borders._lg_border_radius }}>
    <List sx={{ color: theme.jodify_colors._text_white, width: '200px', bgcolor: theme.jodify_colors._background_gray, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: theme.jodify_borders._lg_border_radius }}>
    {typeList?.map((item, index) => {
      const labelId = `checkbox-list-label-${index}`;

      return (
        <ListItem key={index} disablePadding sx={{ marginBottom: '10px', height: '30px'}}>
          <ListItemButton sx={{height: '19px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Roboto Condensed' }} role={undefined} onClick={handleToggle(index)} dense>
            <ListItemIcon sx={{minWidth: '20px'}}>
              <Checkbox
                edge="start"
                checked={checked.indexOf(index) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
                style={{ color: theme.jodify_colors._text_white }}
              />
            </ListItemIcon>
            <ItemTextList id={labelId} primary={item.type_name} />
          </ListItemButton>
        </ListItem>
      );
    })}
  </List>
  </div>
  );
  }

  
}

export default FilterList