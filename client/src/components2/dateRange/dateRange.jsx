import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import theme from "../../jodifyStyles";
import { DateRange } from "./datePickerRange";

function DateRanges(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRange
        value={props.Value}
        onChange={props.OnChange}
        onAccept={props.OnClick}
        onClose={props.OnClose}
        sx={{
          fontSize: "16px",
          color: theme.jodify_colors._text_white,
          bgcolor: theme.jodify_colors._background_gray,
          borderRadius: theme.jodify_borders._lg_border_radius,
        }}
      />
    </LocalizationProvider>
  );
}

export default DateRanges;
