import styled from 'styled-components'
import DatePicker from 'react-datepicker';


export const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* margin: 10px; */
`

export const ResponsiveDatePicker = styled(DatePicker)`
  width: 100%;
  max-width: 300px; /* Adjust as needed */
`;