import styled from  'styled-components'
import theme from '../../jodifyStyles';

export const Wrapper = styled.div`
    width: 92%;
    max-width: 657px;
    margin: 0 auto;
    margin-bottom: 1px;
    height: 50px;
`;

export const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background-color: ${theme.jodify_colors._background_gray};
  border: 1px solid transparent;
  border-color: ${props => props.$isInputClicked ? theme.jodify_colors._icons_primary : 'transparent'};
  border-radius: ${theme.jodify_borders._md_border_radius};
`;


export const SearchInput = styled.input`
    flex: 1; /* Let the input grow and take available space */
    max-width: calc(100% - 3rem); /* Adjust width to leave space for the button */
    outline: none;
    border: none;
    border-radius: 0.25rem;
    padding: 0px 0rem 0rem 0rem;
    font-size: 16px;
    background-color: ${theme.jodify_colors._background_gray};
    color: ${props => props.$isInputClicked ? theme.jodify_colors._text_white : theme.jodify_colors._text_gray};
  
    &::placeholder {
      color: ${props => props.$isInputClicked ? theme.jodify_colors._text_white : theme.jodify_colors._text_gray}; 
    }
`;


export const Span = styled.span`
    position: relative;
    margin-left: 10px;
    &.material-symbols-outlined {
      color: ${props => props.$isInputClicked ? theme.jodify_colors._icons_primary : theme.jodify_colors._icons_primary};
      fill: ${props => props.$isInputClicked ? theme.jodify_colors._icons_primary : theme.jodify_colors._icons_primary};
    }
`

export const SearchButton = styled.button`
    /* width: 60px; */
    height: 2.8rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    /* position: absolute; */
    background: none;
    border: none;
    outline: none;
    padding: 0rem 0rem 0rem 0rem;
    :hover {
        cursor: pointer
    }
`