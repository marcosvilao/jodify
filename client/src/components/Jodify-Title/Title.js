import styled from 'styled-components';

export const BrandContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 40px 16px 10px;
    /* margin-top: 10rem; */
    /* height: 1.2rem; */
    /* width: 100vw; */
`
export const Brand = styled.h1`
    width: fit-content;
    font-family: 'Roboto Condensed', sans-serif;
    color: ${props => props.color};
    font-size: 31px; 
    font-weight: 600;
    /* left: 0; */
    letter-spacing: 0;
    line-height: 1.25em; 
    position: relative;
    top: 0;
    white-space: nowrap;    
`