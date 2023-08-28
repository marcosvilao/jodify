import styled from  'styled-components'

export const Wrapper = styled.div`
    width: 92%;
    max-width: 689px;
    margin: 0 auto;
    /* margin-bottom: 30px; */
`;

export const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border: 0.01px solid;
  border-color: ${props => props.$isInputClicked ? '#A13DCB' : props.color};
  border-radius: 5px;
  transition: border-color 0.9s ease;
  /* Other border styles here */
`;


export const SearchInput = styled.input`
    flex: 1; /* Let the input grow and take available space */
    max-width: calc(100% - 3rem); /* Adjust width to leave space for the button */
    outline: none;
    border: none;
    border-radius: 0.25rem;
    padding: 0px 0rem 0rem 1rem;
    font-size: 1.1rem;
    &::placeholder {
      color: lightgray; /* Change this to the desired color */
    }
`;


export const Span = styled.span`
    position: relative;
    margin-right: 10px;

`

export const SearchButton = styled.button`
    /* width: 60px; */
    height: 2.8rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    /* position: absolute; */
    background: none;
    border: none;
    outline: none;
    padding: 0rem 0rem 0rem 0rem;
    :hover {
        cursor: pointer
    }
`


