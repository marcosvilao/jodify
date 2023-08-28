import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { DatePickerContainer, ResponsiveDatePicker } from './DatePickerStyles';

function Datepicker({ isOpen, onSelect }) {
  const [selectedDate, setSelectedDate] = useState(null);


  useEffect(() => {
    if (isOpen) {
      if (datePickerRef.current) {
        datePickerRef.current.setOpen(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const datePickerRef = React.createRef();

  const handleDateChange = (date) => {
    setSelectedDate(date); // Update the selectedDate state
    onSelect(date); // Call the onSelect function passed as prop
  };

  return (
    <DatePickerContainer>
      <ResponsiveDatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        showPopperArrow={false}
        popperPlacement="bottom"
        popperModifiers={{
          offset: {
            enabled: true,
            offset: '-10px, 0px'
          },
          preventOverflow: {
            enabled: true,
            escapeWithReference: false,
            boundariesElement: 'viewport'
          }
        }}
        customInput={<CustomInput />}
        placeholderText="Fecha"
        isClearable
        ref={datePickerRef}
        popperProps={{
          positionFixed: true,
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [-10, 10],
              },
            },
          ],
        }}
      />
         </DatePickerContainer>
  );
}

const CustomInput = React.forwardRef(({ onClick, value, placeholder }, ref) => (
  <p
    onClick={onClick}
    ref={ref}
    style={{
      border: 'none',
      width: '100%',
      outline: 'none',
      marginBottom: '20px', // Remove any default margin
      padding: '8px', // Add some padding to match input style
      cursor: 'pointer', // Add pointer cursor to indicate it's clickable
    }}
  >
    {value || placeholder}
  </p>
  ));

export default Datepicker;