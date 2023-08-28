import styled from 'styled-components';

export const BrandContainer = styled.div`
    margin: 7rem auto;
    /* margin-top: 10rem; */
    /* height: 1.2rem; */
    /* width: 100vw; */
`
export const Brand = styled.h1`
    width: fit-content;
    margin: 0 auto;
    font-family: 'Roboto Condensed', sans-serif;
    color: ${props => props.color};
    font-size: 1.625rem; 
    font-weight: 600;
    /* left: 0; */
    letter-spacing: 0;
    line-height: 1.25em; 
    position: relative;
    top: 0;
    white-space: nowrap;    
`