import styled from 'styled-components';

export const BrandContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 16px;

`
export const Brand = styled.h1`
    width: fit-content;
    font-family: 'Roboto Condensed', sans-serif;
    color: ${props => props.color};
    font-size: 22px; 
    font-weight: 600;
    /* left: 0; */
    letter-spacing: 0;
    /* line-height: 1.25em;  */
    position: relative;
    top: 0;
    white-space: nowrap;    
`