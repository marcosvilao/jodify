import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { styled } from '@mui/material/styles';
import theme from '../../jodifyStyles';

export const DateRange = styled(StaticDateRangePicker)`
    .css-1a4q4r2-MuiButtonBase-root-MuiPickersDay-root-MuiDateRangePickerDay-day.Mui-selected {
        color: ${theme.jodify_colors._text_white};
        background: ${theme.jodify_colors._gradient};
    }

    .MuiDateRangePickerDay-rangeIntervalDayHighlight {
        background: #343335;

    }

    .css-n899mg-MuiTypography-root-MuiPickersToolbarText-root.Mui-selected{
        
        font-size: 31px;
        color: ${theme.jodify_colors._text_white};
    }

    .css-n899mg-MuiTypography-root-MuiPickersToolbarText-root{
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 31px;
        color: ${theme.jodify_colors._text_white};
    }

    .css-grqin-MuiButtonBase-root-MuiPickersDay-root-MuiDateRangePickerDay-day.Mui-selected{
        background: ${theme.jodify_colors._gradient};
    }

    .css-138poq7-MuiPickersSlideTransition-root-MuiDayCalendar-slideTransition:not(.MuiDateRangeCalendar-dayDragging) .MuiDateRangePickerDay-dayOutsideRangeInterval{
        color: ${theme.jodify_colors._text_white};
        font-size: 13px;
    }

    .css-1e6y48t-MuiButtonBase-root-MuiButton-root{
        font-family: 'Roboto Condensed', sans-serif;
        color: ${theme.jodify_colors._text_white};
    }

    .css-dplwbx-MuiPickersCalendarHeader-label{
        font-size: 16px;
    }

    .css-rhmlg1-MuiTypography-root-MuiDayCalendar-weekDayLabel{

        color: ${theme.jodify_colors._text_white};
        font-size: 12px;
    }

    .css-1nkg345-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button{
        color: ${theme.jodify_colors._text_white};
    }

    .css-kg9q0s-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button{
        color: ${theme.jodify_colors._text_white};
    }

    .css-1hbyad5-MuiTypography-root {
    font-family: 'Roboto Condensed', sans-serif;
    color: transparent;
    font-size: 20px;
    text-transform: capitalize; /* Capitalizar texto */
    line-height: 0; /* Altura de línea */
    letter-spacing: 0; /* Espaciado entre letras */
    font-weight: 0; /* Grosor de fuente */
    }

    .css-12yewq9-MuiPickersLayout-root .MuiPickersLayout-actionBar{
        margin-right: 20px;
    }

    .css-grqin-MuiButtonBase-root-MuiPickersDay-root-MuiDateRangePickerDay-day{
        color: ${theme.jodify_colors._text_white};
    }

    .css-124wamg-MuiTypography-root-MuiPickersToolbarText-root.Mui-selected{
        font-family: 'Roboto Condensed', sans-serif;
        color: ${theme.jodify_colors._text_white};
        font-size: 31px;
    }

    .css-cyfsxc-MuiPickersCalendarHeader-labelContainer{
        font-family: 'Roboto Condensed', sans-serif;
    }

    .css-124wamg-MuiTypography-root-MuiPickersToolbarText-root{
        font-family: 'Roboto Condensed', sans-serif;
        color: ${theme.jodify_colors._text_white};
        font-size: 31px;
    }

    .css-ag7rrr-MuiTypography-root{
        margin-top: 5px;
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 31px;
    }
`